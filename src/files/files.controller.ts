import { BadRequestException, Body, Delete, HttpCode, HttpStatus, Logger, Query } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { CreateFile } from './dto/createFile.dto';
import { File } from './dto/file.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {

    private logger = new Logger(FilesController.name);

    constructor(private service: FilesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async addVertex(@Body() file: CreateFile): Promise<File> {
        return this.service.create(file).then(this.service.fileToFileDto);
    }

    @Get()
    async getAll(): Promise<File[]> {
        return this.service.getAll().then(element => element.map(this.service.fileToFileDto));
    }

    @Get('/filename')
    async getByFilename(@Query('name') filename: string): Promise<File> {
        return this.service.getByFilename(filename).then(res => {
            return this.service.fileToFileDto(res);
        });
    }

    @Delete('/filename')
    async deleteFile(@Query('name') filename: string) {
        if (!filename) {
            throw new BadRequestException('name must be set')
        }
        await this.service.remove(filename);
    }
}
