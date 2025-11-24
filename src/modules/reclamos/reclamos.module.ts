import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReclamosService } from './reclamos.service';
import { ReclamosController } from './reclamos.controller';
import { Reclamo, ReclamoSchema } from './schemas/reclamo.schema';
import { ReclamosRepository } from './repositories/reclamos-repository';
import { ReclamosValidator } from './helpers/reclamos-validator';
import { JwtModule } from '../jwt/jwt.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { HistorialAsignacionModule } from '../historial-asignacion/historial-asignacion.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reclamo.name, schema: ReclamoSchema }]),
    JwtModule,
    UsuarioModule,
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
  ],
})
export class ReclamosModule {}
