import { Test, TestingModule } from '@nestjs/testing';
import { NivelCriticidadController } from './nivel-criticidad.controller';
import { NivelCriticidadService } from './nivel-criticidad.service';

describe('NivelCriticidadController', () => {
  let controller: NivelCriticidadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NivelCriticidadController],
      providers: [NivelCriticidadService],
    }).compile();

    controller = module.get<NivelCriticidadController>(NivelCriticidadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
