import { Module } from '@nestjs/common';
import { HistorialAsignacionService } from './historial-asignacion.service';
import { HistorialAsignacionController } from './historial-asignacion.controller';
import {
  HistorialAsignacion,
  HistorialAsignacionSchema,
} from './schemas/historial-asignacion.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from '../usuario/schema/usuario.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistorialAsignacion.name, schema: HistorialAsignacionSchema },
      { name: Usuario.name, schema: UsuarioSchema },
    ]),
  ],
  controllers: [HistorialAsignacionController],
  providers: [HistorialAsignacionService],
})
export class HistorialAsignacionModule {}
