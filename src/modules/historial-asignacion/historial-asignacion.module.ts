import { Module } from '@nestjs/common';
import { HistorialAsignacionService } from './historial-asignacion.service';
import { HistorialAsignacionController } from './historial-asignacion.controller';
import {
  HistorialAsignacion,
  HistorialAsignacionSchema,
} from './schemas/historial-asignacion.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from '../usuario/schema/usuario.schema';
import { AsignacionInicialStrategy } from './asignacion-strategies/asignacion-inicial.strategy';
import { AsignacionAreaAreaStrategy } from './asignacion-strategies/asignacion-area-area.strategy';
import { AsignacionAreaSubareaStrategy } from './asignacion-strategies/asignacion-area-subarea.strategy';
import { AsignacionAutoasignacionStrategy } from './asignacion-strategies/asignacion-autoasignacion.strategy';
import { AsignacionEmpleadoEmpleadoStrategy } from './asignacion-strategies/asignacion-empleado-empleado.strategy';
import { AsignacionEmpleadoAreaStrategy } from './asignacion-strategies/asignacion-empleado-area.strategy';
import { AsignacionEmpleadoSubareaStrategy } from './asignacion-strategies/asignacion-empleado-subarea.strategy';
import { IAsignacionStrategy } from './asignacion-strategies/asignacion-strategy.interface';
import { HistorialAsignacionRepository } from './repositories/historial-asignacion-interface.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistorialAsignacion.name, schema: HistorialAsignacionSchema },
      { name: Usuario.name, schema: UsuarioSchema },
    ]),
  ],
  controllers: [HistorialAsignacionController],
  providers: [
    HistorialAsignacionService,
    AsignacionInicialStrategy,
    AsignacionAreaAreaStrategy,
    AsignacionAreaSubareaStrategy,
    AsignacionAutoasignacionStrategy,
    AsignacionEmpleadoEmpleadoStrategy,
    AsignacionEmpleadoAreaStrategy,
    AsignacionEmpleadoSubareaStrategy,
    {
      provide: 'IHistorialAsignacionRepository',
      useClass: HistorialAsignacionRepository,
    },
    {
      provide: 'ASIGNACION_STRATEGIES',
      useFactory: (...strategies: IAsignacionStrategy[]) => strategies,
      inject: [
        AsignacionInicialStrategy,
        AsignacionAreaAreaStrategy,
        AsignacionAreaSubareaStrategy,
        AsignacionAutoasignacionStrategy,
        AsignacionEmpleadoEmpleadoStrategy,
        AsignacionEmpleadoAreaStrategy,
        AsignacionEmpleadoSubareaStrategy,
      ],
    },
  ],
  exports: [HistorialAsignacionService],
})
export class HistorialAsignacionModule {}
