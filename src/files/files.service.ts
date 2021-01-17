import { Injectable, Logger } from '@nestjs/common';
import { DatabaseAdapterService } from 'src/database-adapter/database-adapter.service';
import { File as FileDto } from './dto/file.dto';
import { File } from './entity/file.entity';

@Injectable()
export class FilesService {
    private logger = new Logger(FilesService.name);
    constructor(
        private db: DatabaseAdapterService
    ) {}

    // TODO: Implement
    async create(file: FileDto) {
        const entity = new File(file.fileName, file.userName, file.text);
        this.logger.log(JSON.stringify(entity));
        return this.db.addVertex(entity).catch(reason => {
            this.logger.error(reason);
        });
    }

    // TODO: Implement
    async getAll(): Promise<FileDto[]> {
        return this.db.getAll('File');
    }
}
