import { Test, TestingModule } from '@nestjs/testing';
import { MemorialsService } from './memorials.service';

describe('MemorialsService', () => {
  let service: MemorialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemorialsService],
    }).compile();

    service = module.get<MemorialsService>(MemorialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
