import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrioridadService } from './prioridad.service';
import { PrioridadController } from './prioridad.controller';
import { PrioridadSchema } from './schemas/prioridad.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Prioridad', schema: PrioridadSchema }]),
  ],
  controllers: [PrioridadController],
  providers: [PrioridadService],
})
export class PrioridadModule {}
