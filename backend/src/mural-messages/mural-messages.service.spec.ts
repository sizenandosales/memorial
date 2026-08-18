import { Test, TestingModule } from '@nestjs/testing';
import { MuralMessagesService } from './mural-messages.service';

describe('MuralMessagesService', () => {
  let service: MuralMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MuralMessagesService],
    }).compile();

    service = module.get<MuralMessagesService>(MuralMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
