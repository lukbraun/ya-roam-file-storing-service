import { InjectModel } from '@dinohorvat/azure-database';
import { Injectable } from '@nestjs/common';
import { File } from './entity/file.entity';
import { File as FileDto } from './dto/file.dto';
import { Container } from '@azure/cosmos';

@Injectable()
export class FilesService {
    constructor(
        @InjectModel(File)
        private readonly fileContainer: Container,
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
