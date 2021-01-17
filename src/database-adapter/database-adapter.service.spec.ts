import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseAdapterService } from './database-adapter.service';

describe('DatabaseAdapterService', () => {
  let service: DatabaseAdapterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseAdapterService],
    }).compile();

    service = module.get<DatabaseAdapterService>(DatabaseAdapterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
