import { Module } from '@nestjs/common';
import { DatabaseAdapterModule } from 'src/database-adapter/database-adapter.module';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
    imports: [DatabaseAdapterModule],
    providers: [TagsService],
    controllers: [TagsController],
    exports: [TagsService],
})
export class TagsModule { }
