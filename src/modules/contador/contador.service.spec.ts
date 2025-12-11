import { Test, TestingModule } from '@nestjs/testing';
import { ContadorService } from './contador.service';

describe('ContadorService', () => {
  let service: ContadorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContadorService],
    }).compile();

    service = module.get<ContadorService>(ContadorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
