import { Module } from '@nestjs/common';
import { HistorialEstadoService } from './historial-estado.service';
import { HistorialEstadoController } from './historial-estado.controller';
import {
  HistorialEstado,
  HistorialEstadoSchema,
} from './schema/historial-estado.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistorialEstado.name, schema: HistorialEstadoSchema },
    ]),
  ],
  controllers: [HistorialEstadoController],
  providers: [HistorialEstadoService],
})
export class HistorialEstadoModule {}
