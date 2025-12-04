import { Test, TestingModule } from '@nestjs/testing';
import { HistorialAsignacionController } from './historial-asignacion.controller';
import { HistorialAsignacionService } from './historial-asignacion.service';

describe('HistorialAsignacionController', () => {
  let controller: HistorialAsignacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialAsignacionController],
      providers: [HistorialAsignacionService],
    }).compile();

    controller = module.get<HistorialAsignacionController>(HistorialAsignacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
