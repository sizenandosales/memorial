import { Test, TestingModule } from '@nestjs/testing';
import { MemorialsController } from './memorials.controller';

describe('MemorialsController', () => {
  let controller: MemorialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemorialsController],
    }).compile();

    controller = module.get<MemorialsController>(MemorialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
