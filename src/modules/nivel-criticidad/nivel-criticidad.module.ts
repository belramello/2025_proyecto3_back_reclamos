import { Module } from '@nestjs/common';
import { NivelCriticidadService } from './nivel-criticidad.service';
import { NivelCriticidadController } from './nivel-criticidad.controller';

import { MongooseModule } from '@nestjs/mongoose';
import NivelCriticidadSchema from './schemas/nivel-criticidad.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'NivelCriticidad', schema: NivelCriticidadSchema }])],
  controllers: [NivelCriticidadController],
  providers: [NivelCriticidadService],
})
export class NivelCriticidadModule {}
