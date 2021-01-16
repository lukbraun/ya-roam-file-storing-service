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

    async create(file: FileDto) {
        console.log(file);
        const f = new File();
        f.filename = file.fileName;
        f.text = file.text;
        f.userName = file.userName;
        this.fileContainer.items.create(file);
        return file;
    }
    async getAll(): Promise<FileDto[]> {
        const querySpec = {
            query: "g.V()"
        }
        const { resources } = await this.fileContainer.items.query<File>(querySpec).fetchAll();
        console.log(resources);
        return [];
    }
}
