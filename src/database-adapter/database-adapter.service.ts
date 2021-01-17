import { Inject, Injectable, Logger } from '@nestjs/common';
import { Config } from './database.config';
import * as Gremlin from 'gremlin';
import { Entity } from './database-entity';
if (process.env.NODE_ENV !== 'production') require('dotenv').config({ debug: true });

@Injectable()
export class DatabaseAdapterService {
    private client: Gremlin.driver.Client;
    private readonly logger = new Logger(DatabaseAdapterService.name);
    constructor() {
        const config: Config = {
            endpoint: process.env.AZURE_COSMOS_DB_ENDPOINT,
            database: process.env.AZURE_COSMOS_DB_NAME,
            collection: process.env.AZURE_COSMOS_DB_COLLECTION,
            key: process.env.AZURE_COSMOS_DB_KEY,
        }
        const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${config.database}/colls/${config.collection}`, config.key);
        this.client = new Gremlin.driver.Client(
            config.endpoint,
            {
                authenticator,
                traversalsource: "g",
                rejectUnauthorized: true,
                mimeType: "application/vnd.gremlin-v2.0+json"
            }
        );
    }

    private async submit(stmt: DatabaseStatement): Promise<any> {
        return this.client.submit(stmt.stmt, stmt.params).then(res => {
            return res;
        });
    }

    public addVertex(e: Entity): Promise<any> {
        const stmt = e.addV();
        return this.submit(stmt);
    }

    public addRelation(source: Entity, target: Entity, relationship: string): Promise<any> {
        const stmt = source.addEdgeTo(target, relationship);
        return this.submit(stmt);
    }

    public runStatement(stmt: DatabaseStatement): Promise<any> {
        this.logger.log(`Submit: ${stmt.stmt}`);
        return this.submit(stmt);
    }

    public async getAll(label: string) {
        const stmt: DatabaseStatement = {
            params: [],
            stmt: `g.V().hasLabel('${label}')`
        };
        const res = await this.runStatement(stmt);
        return res._items.map((i: { properties: any; }) => ({
                ...i.properties
            }));

    }
}
