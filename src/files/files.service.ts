import { Inject, Injectable } from '@nestjs/common';
import { DatabaseAdapterService } from 'src/database-adapter/database-adapter.service';
import { File as FileDto } from './dto/file.dto';

@Injectable()
export class FilesService {
    constructor(
        @Inject() db: DatabaseAdapterService
    ) { }

    // TODO: Implement
    async create(file: FileDto) {
        return file;
    }

    // TODO: Implement
    async getAll(): Promise<FileDto[]> {
        return [];
    }
}
