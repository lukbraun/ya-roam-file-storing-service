import { Module } from '@nestjs/common';
import { DatabaseAdapterService } from './database-adapter.service';

@Module({
  providers: [DatabaseAdapterService],
  exports: [DatabaseAdapterService]
})
export class DatabaseAdapterModule {}
