import { Injectable, Logger } from '@nestjs/common';
import { DatabaseAdapterService } from 'src/database-adapter/database-adapter.service';
import { File as FileDto } from './dto/file.dto';
import { File } from './entity/file.entity';

@Injectable()
export class FilesService {
    private logger = new Logger(FilesService.name);
    constructor(
        private db: DatabaseAdapterService
    ) { }

    public fileToFileDto(entity: File): FileDto {
        return {
            fileName: entity.filename,
            userName: entity.username,
            text: entity.text,
            title: [], // TODO: Find all Tags
            tags: [] // TODO: Find all Titles
        }
    }

    private getFileFromResult(_properties: any): File {
        return new File(_properties.filename[0].value, _properties.username[0].value, _properties.text[0].value);
    }

    async create(file: FileDto) {
        const entity = new File(file.fileName, file.userName, file.text);
        return this.db.addVertex(entity)
            .then(element => this.getFileFromResult(element._items))
            .catch(reason => {
                this.logger.error(reason);
                return reason;
            });
    }

    async getAll(): Promise<File[]> {
        return this.db.getAll('File').then(res =>
            res.map(this.getFileFromResult)
        );
    }

    async getByFilename(filename: string): Promise<File> {
        const stmt: DatabaseStatement = {
            stmt: "g.V().hasLabel('File').has('filename', filename)",
            params: {
                filename: filename
            }
        }
        return this.db.runStatement(stmt).then(res => {
            return this.getFileFromResult(res._items[0].properties);
        })
    }
}
