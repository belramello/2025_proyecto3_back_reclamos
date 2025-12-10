import { forwardRef, Module } from '@nestjs/common';
import { HistorialEstadoService } from './historial-estado.service';
import { HistorialEstadoController } from './historial-estado.controller';
import {
  HistorialEstado,
  HistorialEstadoSchema,
} from './schema/historial-estado.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ICreacionHistorialStrategy } from './estados-strategies/creacion-historial-strategy.interface';
import { ResueltoStrategy } from './estados-strategies/resuelto-strategy';
import { InicialPendienteAAsignarStrategy } from './estados-strategies/pendiente-asignar-inicial-strategy';
import { ReasignadoPendienteAAsignarStrategy } from './estados-strategies/pendiente-asignar-reasignado-strategy';
import { EnProcesoStrategy } from './estados-strategies/en-proceso-strategy';
import { HistorialEstadoRepository } from './repositories/historial-estado.repository';
import { EstadosModule } from '../estados/estados.module';
import { ReclamosModule } from '../reclamos/reclamos.module';
import { HistorialEstadosMapper } from './mappers/historial-estado-mapper';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistorialEstado.name, schema: HistorialEstadoSchema },
    ]),
    EstadosModule,
    forwardRef(() => ReclamosModule),
  ],
  controllers: [HistorialEstadoController],
  providers: [
    HistorialEstadoService,
    HistorialEstadosMapper,
    ResueltoStrategy,
    InicialPendienteAAsignarStrategy,
    ReasignadoPendienteAAsignarStrategy,
    EnProcesoStrategy,
    {
      provide: 'CREACION_HISTORIAL_STRATEGIES',
      useFactory: (...strategies: ICreacionHistorialStrategy[]) => strategies,
      inject: [
        ResueltoStrategy,
        InicialPendienteAAsignarStrategy,
        ReasignadoPendienteAAsignarStrategy,
        EnProcesoStrategy,
      ],
    },
    {
      provide: 'IHistorialEstadoRepository',
      useClass: HistorialEstadoRepository,
    },
  ],
  exports: [HistorialEstadoService, HistorialEstadosMapper],
})
export class HistorialEstadoModule {}
