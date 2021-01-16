import { Module } from '@nestjs/common';
import { AzureCosmosDbModule } from '@dinohorvat/azure-database';
import { File } from './dto/file.dto';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
  imports: [
    AzureCosmosDbModule.forRoot({
      dbName: process.env.AZURE_COSMOS_DB_NAME,
      endpoint: process.env.AZURE_COSMOS_DB_ENDPOINT,
      key: process.env.AZURE_COSMOS_DB_KEY,
    }),
    AzureCosmosDbModule.forFeature([{ dto: File }])
  ],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
