import { Test, TestingModule } from '@nestjs/testing';
import { PrioridadService } from './prioridad.service';

describe('PrioridadService', () => {
  let service: PrioridadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrioridadService],
    }).compile();

    service = module.get<PrioridadService>(PrioridadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
