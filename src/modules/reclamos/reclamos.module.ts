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
import { ReclamosMapper } from './helpers/reclamos-mapper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reclamo.name, schema: ReclamoSchema }]),
    JwtModule,
    AreasModule,
    forwardRef(() => HistorialEstadoModule),
    HistorialAsignacionModule,
    forwardRef(() => UsuarioModule),
    forwardRef(() => SubareasModule),
    MailModule,
    HistorialAsignacionModule,
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
  ],
  exports: [ReclamosService],
})
export class ReclamosModule {}
