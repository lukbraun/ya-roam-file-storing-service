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
    ){}

    async create(file: FileDto): Promise<FileDto> {
        return this.fileContainer.items.create(file);
    }
}
