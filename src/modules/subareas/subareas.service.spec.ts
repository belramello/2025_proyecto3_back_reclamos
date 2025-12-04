import { Test, TestingModule } from '@nestjs/testing';
import { SubareasService } from './subareas.service';

describe('SubareasService', () => {
  let service: SubareasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubareasService],
    }).compile();

    service = module.get<SubareasService>(SubareasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
