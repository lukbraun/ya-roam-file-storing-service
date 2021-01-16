import { Module } from '@nestjs/common';
import { TagsModule } from './tags/tags.module';
import { FilesModule } from './files/files.module';
import { AzureCosmosDbModule } from '@dinohorvat/azure-database';
if (process.env.NODE_ENV !== 'production') require('dotenv').config({ debug: true });

@Module({
  imports: [TagsModule, FilesModule,
    AzureCosmosDbModule.forRoot({
      dbName: process.env.AZURE_COSMOS_DB_NAME,
      endpoint: process.env.AZURE_COSMOS_DB_ENDPOINT,
      key: process.env.AZURE_COSMOS_DB_KEY,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
