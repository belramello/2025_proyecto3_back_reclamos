import { Test, TestingModule } from '@nestjs/testing';
import { HistorialEstadoService } from './historial-estado.service';

describe('HistorialEstadoService', () => {
  let service: HistorialEstadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistorialEstadoService],
    }).compile();

    service = module.get<HistorialEstadoService>(HistorialEstadoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
