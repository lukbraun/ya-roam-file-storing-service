import { Body, HttpCode, HttpStatus, Logger, Query } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { File } from './dto/file.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {

    private logger = new Logger(FilesController.name);

    constructor(private service: FilesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async addVertex(@Body() file: File): Promise<File> {
        return this.service.create(file).then(this.service.fileToFileDto);
    }

    @Get()
    async getAll(): Promise<File[]> {
        return this.service.getAll().then(element => element.map(this.service.fileToFileDto));
    }

    @Get('/filename')
    async getByFilename(@Query('name') filename: string): Promise<any> {
        return this.service.getByFilename(filename).then(res => {
            this.logger.log(JSON.stringify(res));
            return this.service.fileToFileDto(res);
        });
    }

    // @Get('/tag')
    // async getFilesWithTag(@Query('tags') tags): Promise<File[]> {
    //     return [];
    // }
}
