import { Test, TestingModule } from '@nestjs/testing';
import { PrioridadController } from './prioridad.controller';
import { PrioridadService } from './prioridad.service';

describe('PrioridadController', () => {
  let controller: PrioridadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrioridadController],
      providers: [PrioridadService],
    }).compile();

    controller = module.get<PrioridadController>(PrioridadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
