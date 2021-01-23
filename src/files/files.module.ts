import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { DatabaseAdapterModule } from 'src/database-adapter/database-adapter.module';
import { ServicebusModule } from 'src/servicebus/servicebus.module';
import { TagsModule } from 'src/tags/tags.module';
import { TitleModule } from 'src/title/title.module';


@Module({
  imports: [DatabaseAdapterModule, ServicebusModule, TagsModule, TitleModule],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
