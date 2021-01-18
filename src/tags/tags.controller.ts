import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import { Tag } from './dto/tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {

    private logger = new Logger(TagsController.name);

    constructor(private tagService: TagsService) { }

    @Get()
    async getAllTags(): Promise<Tag[]> {
        return this.tagService.getAll().then(res => res.map(this.tagService.tagToDto));
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async addVertex(@Body() tag: Tag): Promise<Tag> {
        return this.tagService.create(tag).then(this.tagService.tagToDto);
    }

    @Get('/tagname')
    async getByName(@Query('name') tagname: string): Promise<Tag> {
        return this.tagService.getByName(tagname).then(this.tagService.tagToDto).catch(res => {
            return res;
        });
    }

    @Delete()
    async remove(@Query('name') name: string): Promise<any> {
        if (!name) {
            throw new BadRequestException('name must be set')
        }
        this.tagService.remove(name).then(res => ({}));
    }
}
