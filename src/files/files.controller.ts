import { BadRequestException, Body, Delete, HttpCode, HttpStatus, Logger, NotFoundException, Query } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { CreateFile } from './dto/createFile.dto';
import { File } from './dto/file.dto';
import { EmptyFile } from './entity/emptyFile.entity';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {

    private logger = new Logger(FilesController.name);

    constructor(private service: FilesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async addVertex(@Body() file: CreateFile): Promise<CreateFile> {
        return this.service.create(file).then(_ => file);
    }

    @Get()
    async getAll(): Promise<File[]> {
        return await this.service.getAll();
    }

    @Get('/filename')
    async getByFilename(@Query('name') filename: string): Promise<File> {
        return this.service.getByFilename(filename)
            .then(file => {
                if (file instanceof EmptyFile) {
                    throw new NotFoundException(`File "${filename}" not found`);
                }
                return file;
            })
            .then(res => {
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

    @Post("/clean")
    @HttpCode(HttpStatus.OK)
    async cleanDb() {
        this.service.cleanUp();
    }
}
