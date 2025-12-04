import { Test, TestingModule } from '@nestjs/testing';
import { SubareasController } from './subareas.controller';
import { SubareasService } from './subareas.service';

describe('SubareasController', () => {
  let controller: SubareasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubareasController],
      providers: [SubareasService],
    }).compile();

    controller = module.get<SubareasController>(SubareasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
