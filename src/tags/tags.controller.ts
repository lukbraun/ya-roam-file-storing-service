import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import { Tag } from './dto/tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {

    private logger = new Logger(TagsController.name);

    constructor(private tagService: TagsService) {}

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
            this.logger.log(JSON.stringify(res));
            return res;
        });
    }
}
