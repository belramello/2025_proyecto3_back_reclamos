import { Test, TestingModule } from '@nestjs/testing';
import { HistorialAsignacionService } from './historial-asignacion.service';

describe('HistorialAsignacionService', () => {
  let service: HistorialAsignacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistorialAsignacionService],
    }).compile();

    service = module.get<HistorialAsignacionService>(HistorialAsignacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
