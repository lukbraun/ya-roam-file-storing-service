import { Module } from '@nestjs/common';
import { TagsModule } from './tags/tags.module';
import { FilesModule } from './files/files.module';
import { DatabaseAdapterModule } from './database-adapter/database-adapter.module';

@Module({
  imports: [TagsModule, FilesModule, DatabaseAdapterModule],
  controllers: [],
  providers: [],
  exports: [DatabaseAdapterModule]
})
export class AppModule { }
