import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import { Title } from './dto/title.dto';
import { TitleService } from './title.service';

@Controller('title')
export class TitleController {
    private logger = new Logger(TitleController.name);

    constructor(private service: TitleService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() title: Title): Promise<Title> {
        return this.service.create(title).then(this.service.titleToDto);
    }

    @Get()
    async getAll(): Promise<Title[]> {
        return this.service.getAll().then(res => res.map(this.service.titleToDto));
    }

    @Get('/titlename')
    async getByName(@Query('name') name: string): Promise<Title> {
        return this.service.getByName(name).then(this.service.titleToDto);
    }
    @Delete()
    async remove(@Query('name') name: string): Promise<any> {
        if (!name) {
            throw new BadRequestException('name must be set')
        }
        this.service.remove(name).then(res => ({}));
    }
}
