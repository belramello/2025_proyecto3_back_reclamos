import { Test, TestingModule } from '@nestjs/testing';
import { TipoReclamoService } from './tipo-reclamo.service';

describe('TipoReclamoService', () => {
  let service: TipoReclamoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoReclamoService],
    }).compile();

    service = module.get<TipoReclamoService>(TipoReclamoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
