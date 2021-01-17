import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseAdapterService } from './database-adapter.service';
import { Config } from './database.config';

@Module({})
export class DatabaseAdapterModule {
    public static forRoot(options: Config): DynamicModule {
      return {
        module: DatabaseAdapterModule,
        providers: [
          {
            provide: 'CONFIG',
            useValue: options
          },
          DatabaseAdapterService
        ],
        exports: [DatabaseAdapterService],
      }
    }
}
