import { Module } from '@nestjs/common';
import { TagsModule } from './tags/tags.module';
import { FilesModule } from './files/files.module';
import { DatabaseAdapterModule } from './database-adapter/database-adapter.module';
if (process.env.NODE_ENV !== 'production') require('dotenv').config({ debug: true });

@Module({
  imports: [TagsModule, FilesModule,
    DatabaseAdapterModule.forRoot({
      endpoint: process.env.AZURE_COSMOS_DB_ENDPOINT,
      database: process.env.AZURE_COSMOS_DB_NAME,
      collection: process.env.AZURE_COSMOS_DB_COLLECTION,
      key: process.env.AZURE_COSMOS_DB_KEY,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
