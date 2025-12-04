import { Test, TestingModule } from '@nestjs/testing';
import { ReclamosController } from './reclamos.controller';
import { ReclamosService } from './reclamos.service';

describe('ReclamosController', () => {
  let controller: ReclamosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReclamosController],
      providers: [ReclamosService],
    }).compile();

    controller = module.get<ReclamosController>(ReclamosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
