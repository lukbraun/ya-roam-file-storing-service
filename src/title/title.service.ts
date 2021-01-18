import { Injectable, Logger } from '@nestjs/common';
import { DatabaseAdapterService } from 'src/database-adapter/database-adapter.service';
import { Title } from './entity/title.entity';
import { Title as TitleDto } from './dto/title.dto';

@Injectable()
export class TitleService {
    private logger = new Logger(TitleService.name);

    constructor(private db: DatabaseAdapterService) { }

    public titleToDto(entity: Title): TitleDto {
        return {
            name: entity.name
        }
    }

    private getTitleFromResult(_properties: any): Title {
        return new Title(_properties.name[0].value);
    }

    async create(title: TitleDto): Promise<Title> {
        const entity = new Title(title.name);
        return this.db.addVertex(entity)
            .then(element => this.getTitleFromResult(element._items[0].properties))
            .catch(reason => {
                this.logger.error(reason);
                return reason;
            })
    }

    async getAll(): Promise<Title[]> {
        return this.db.getAll('Title').then(res => res.map(this.getTitleFromResult));
    }

    async getByName(name: string): Promise<Title> {
        const stmt: DatabaseStatement = {
            stmt: "g.V().hasLabel('Title').has('name', name)",
            params: {
                name: name
            }
        }
        return this.db.runStatement(stmt).then(res => this.getTitleFromResult(res._items[0].properties))
    }

}
