import { Body } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { File } from './dto/file.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {

    constructor(private service: FilesService) {}

    @Post()
    async create(@Body() file: File): Promise<File> {
        console.log(file);
        return this.service.create(file);
    }

    @Get()
    async getAll(): Promise<File[]> {
        return this.service.getAll();
    }
}
