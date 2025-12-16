import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProyectosService } from './proyectos.service';
import { ProyectosController } from './proyectos.controller';
import { Proyecto, ProyectoSchema } from './schemas/proyecto.schema';
import { ProyectosRepository } from './repositories/proyectos-repository';
import { UsuarioModule } from '../usuario/usuario.module';
import { JwtModule } from '../jwt/jwt.module';
import { ProyectosValidator } from './helpers/proyectos-validator';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Proyecto.name, schema: ProyectoSchema },
    ]),
    forwardRef(() => UsuarioModule),
    JwtModule,
  ],
  controllers: [ProyectosController],
  providers: [
    ProyectosService,
    {
      provide: 'ProyectosRepositoryInterface',
      useClass: ProyectosRepository,
    },
    ProyectosValidator,
  ],
  exports: [ProyectosService, ProyectosValidator],
})
export class ProyectosModule {}
