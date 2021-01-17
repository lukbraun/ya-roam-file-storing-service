import { Inject, Injectable, Logger } from '@nestjs/common';
import { Config } from './database.config';
import * as Gremlin from 'gremlin';

@Injectable()
export class DatabaseAdapterService {
    private client: Gremlin.driver.Client;
    private readonly logger = new Logger(DatabaseAdapterService.name);
    constructor(@Inject('CONFIG') config: Config) {
        this.logger.log(JSON.stringify(config));
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
            this.logger.log(`Result: ${JSON.stringify(res)}`);
        });
    }

    public addVertex<T>(e: Entity<T>): Promise<any> {
        this.logger.log(`Add Vertex: ${e.getId()}`)
        const stmt = e.addV();
        return this.submit(stmt);
    }

    public addRelation<S, T>(source: Entity<S>, target: Entity<T>, relationship: string): Promise<any> {
        this.logger.log(`Add Edge: ${source.getId()} -[${relationship}]-> ${target.getId()}`)
        const stmt = source.addEdgeTo(target, relationship);
        return this.submit(stmt);
    }

    public runStatement(stmt: DatabaseStatement): Promise<any> {
        this.logger.log(`Submit: ${stmt.stmt}`);
        return this.submit(stmt);
    }
}
