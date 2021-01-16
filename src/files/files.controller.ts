import { Controller, Post } from '@nestjs/common';
import { File } from './dto/file.dto';

@Controller('files')
export class FilesController {

    @Post()
    async create(file: File): Promise<File> {
        return this.eventContainer.items.create(file);
    }
}
