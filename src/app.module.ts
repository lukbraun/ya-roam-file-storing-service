import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesController } from './files/files.controller';
import { TagsController } from './tags/tags.controller';

@Module({
  imports: [],
  controllers: [AppController, FilesController, TagsController],
  providers: [AppService],
})
export class AppModule {}
