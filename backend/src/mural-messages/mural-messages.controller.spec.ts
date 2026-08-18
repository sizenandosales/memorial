import { Test, TestingModule } from '@nestjs/testing';
import { MuralMessagesController } from './mural-messages.controller';

describe('MuralMessagesController', () => {
  let controller: MuralMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MuralMessagesController],
    }).compile();

    controller = module.get<MuralMessagesController>(MuralMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
