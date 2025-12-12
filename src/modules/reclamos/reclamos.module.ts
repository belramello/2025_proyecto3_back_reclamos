import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReclamosService } from './reclamos.service';
import { ReclamosController } from './reclamos.controller';
import { Reclamo, ReclamoSchema } from './schemas/reclamo.schema';
import { ReclamosRepository } from './repositories/reclamos-repository';
import { ReclamosValidator } from './helpers/reclamos-validator';
import { JwtModule } from '../jwt/jwt.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { HistorialAsignacionModule } from '../historial-asignacion/historial-asignacion.module';
import { HistorialEstadoModule } from '../historial-estado/historial-estado.module';
import { SubareasModule } from '../subareas/subareas.module';
import { AreasModule } from '../areas/areas.module';
import { MailModule } from '../mail/mail.module';
import {
  HistorialEstado,
  HistorialEstadoSchema,
} from '../historial-estado/schema/historial-estado.schema';
import { ReclamosMapper } from './helpers/reclamos-mapper';
import {
  TipoReclamo,
  TipoReclamoSchema,
} from '../tipo-reclamo/schemas/tipo-reclamo.schema';
import { Area, AreaSchema } from '../areas/schemas/area.schema';
import { ReclamosHelper } from './helpers/reclamos-helper';
import { ProyectosModule } from '../proyectos/proyectos.module';
import { TipoReclamoModule } from '../tipo-reclamo/tipo-reclamo.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reclamo.name, schema: ReclamoSchema },
      { name: HistorialEstado.name, schema: HistorialEstadoSchema },
      { name: TipoReclamo.name, schema: TipoReclamoSchema },
      { name: Area.name, schema: AreaSchema },
    ]),
    JwtModule,
    AreasModule,
    HistorialAsignacionModule,
    forwardRef(() => UsuarioModule),
    forwardRef(() => SubareasModule),
    MailModule,
    HistorialEstadoModule,
    HistorialAsignacionModule,
    ProyectosModule,
    TipoReclamoModule,
  ],
  controllers: [ReclamosController],
  providers: [
    ReclamosService,
    {
      provide: 'IReclamosRepository',
      useClass: ReclamosRepository,
    },
    ReclamosValidator,
    ReclamosMapper,
    ReclamosHelper,
  ],
  exports: [ReclamosService],
})
export class ReclamosModule {}
