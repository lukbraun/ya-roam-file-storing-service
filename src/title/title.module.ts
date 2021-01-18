import { Module } from '@nestjs/common';
import { TitleService } from './title.service';
import { TitleController } from './title.controller';
import { DatabaseAdapterModule } from 'src/database-adapter/database-adapter.module';

@Module({
  imports: [DatabaseAdapterModule],
  providers: [TitleService],
  controllers: [TitleController],
  exports: [TitleService]
})
export class TitleModule {}
