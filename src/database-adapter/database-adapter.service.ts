import { Injectable, Logger } from '@nestjs/common';
import { Config } from './database.config';
import * as Gremlin from 'gremlin';

@Injectable()
export class DatabaseAdapterService {
    private client: Gremlin.driver.Client;
    private readonly logger = new Logger(DatabaseAdapterService.name);
    constructor(config: Config) {
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
            this.logger.log(`Result: ${res}`);
        });
    }

    public addVertex<T>(e: Entity<T>): Promise<any> {
        const stmt = e.addV();
        return this.submit(stmt);
    }

    public addRelation<S, T>(source: Entity<S>, target: Entity<T>, relationship: string): Promise<any> {
        const stmt = source.addEdgeTo(target, relationship);
        return this.submit(stmt);
    }

    public runStatement(stmt: DatabaseStatement): Promise<any> {
        return this.submit(stmt);
    }
}
