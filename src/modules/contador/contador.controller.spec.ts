import { Test, TestingModule } from '@nestjs/testing';
import { ContadorController } from './contador.controller';
import { ContadorService } from './contador.service';

describe('ContadorController', () => {
  let controller: ContadorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContadorController],
      providers: [ContadorService],
    }).compile();

    controller = module.get<ContadorController>(ContadorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
