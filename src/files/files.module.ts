import { Module } from '@nestjs/common';
import { AzureCosmosDbModule } from '@dinohorvat/azure-database';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File } from './entity/file.entity';


@Module({
  imports: [
    AzureCosmosDbModule.forFeature([{ dto: File }])
  ],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
