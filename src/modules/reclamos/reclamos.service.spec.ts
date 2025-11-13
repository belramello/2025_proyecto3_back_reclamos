import { Test, TestingModule } from '@nestjs/testing';
import { ReclamosService } from './reclamos.service';

describe('ReclamosService', () => {
  let service: ReclamosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReclamosService],
    }).compile();

    service = module.get<ReclamosService>(ReclamosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
