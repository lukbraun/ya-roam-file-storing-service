import { Test, TestingModule } from '@nestjs/testing';
import { ServicebusService } from './servicebus.service';

describe('ServicebusService', () => {
  let service: ServicebusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicebusService],
    }).compile();

    service = module.get<ServicebusService>(ServicebusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
