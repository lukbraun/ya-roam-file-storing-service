import { Body } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { File } from './dto/file.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {

    constructor(private service: FilesService) {}

    @Get()
    async getAll(): Promise<File[]> {
        return this.service.getAll();
    }

    @Get('/tag')
    async getFilesWithTag(@Query('tags') tags): Promise<File[]> {
        return this.service.getWithTag();
    }
}
