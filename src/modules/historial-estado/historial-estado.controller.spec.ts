import { Test, TestingModule } from '@nestjs/testing';
import { HistorialEstadoController } from './historial-estado.controller';
import { HistorialEstadoService } from './historial-estado.service';

describe('HistorialEstadoController', () => {
  let controller: HistorialEstadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialEstadoController],
      providers: [HistorialEstadoService],
    }).compile();

    controller = module.get<HistorialEstadoController>(HistorialEstadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
