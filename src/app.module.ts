import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesController } from './files/files.controller';
import { TagsController } from './tags/tags.controller';
import { FilesService } from './files/files.service';
import { TagsService } from './tags/tags.service';

@Module({
  imports: [],
  controllers: [AppController, FilesController, TagsController],
  providers: [AppService, FilesService, TagsService],
})
export class AppModule {}
