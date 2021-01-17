import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { DatabaseAdapterModule } from 'src/database-adapter/database-adapter.module';


@Module({
  imports: [DatabaseAdapterModule],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
