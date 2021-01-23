import { Injectable, Logger } from '@nestjs/common';
import { DatabaseAdapterService } from 'src/database-adapter/database-adapter.service';
import { Tag } from './entity/tag.entity';
import { Tag as TagDto } from './dto/tag.dto';

@Injectable()
export class TagsService {
    private logger = new Logger(TagsService.name);

    constructor(private db: DatabaseAdapterService) { }

    public tagToDto(entity: Tag): TagDto {
        return {
            name: entity.name
        }
    }

    getFromResult(_properties: any): Tag {
        return new Tag(_properties.name[0].value);
    }

    async create(dto: TagDto) {
        const entity = new Tag(dto.name);
        return this.db.addVertex(entity)
            .then(element => this.getFromResult(element._items[0].properties));
    }

    async getAll(): Promise<Tag[]> {
        return this.db.getAll('Tag').then(res => res.map(this.getFromResult));
    }

    async getByName(name: string): Promise<Tag> {
        const stmt: DatabaseStatement = {
            stmt: "g.V().hasLabel('Tag').has('name', name)",
            params: {
                name: name
            }
        }
        return this.db.runStatement(stmt).then(res => this.getFromResult(res._items[0].properties));
    }

    async remove(name: string): Promise<boolean> {
        const stmt: DatabaseStatement = {
            stmt: "g.V().hasLabel(label).has('name', name).drop()",
            params: {
                label: "Tag",
                name: name
            }
        }
        return this.db.runStatement(stmt).then(_ => true);
    }

    public cleanUp() {
        const stmt: DatabaseStatement = {
            stmt: "g.V().hasLabel(label).not(inE(relName)).drop()",
            params: {
                label: "Tag",
                relName: "hasTag"
            }
        }
        return this.db.runStatement(stmt).then(_ => true);
    }

}
