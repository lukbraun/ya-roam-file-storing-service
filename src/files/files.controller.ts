import { BadRequestException, Body, Delete, HttpCode, HttpStatus, Logger, NotFoundException, Query } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { TagsService } from 'src/tags/tags.service';
import { TitleService } from 'src/title/title.service';
import { CreateFile } from './dto/createFile.dto';
import { File } from './dto/file.dto';
import { EmptyFile } from './entity/emptyFile.entity';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {

    private logger = new Logger(FilesController.name);

    constructor(private service: FilesService, private tagService: TagsService, private titleService: TitleService) { }

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
        this.logger.log("Remove unconnected title & tag vertices");
        this.tagService.cleanUp();
        this.titleService.cleanUp();
    }
}
