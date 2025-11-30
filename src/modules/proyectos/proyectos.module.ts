import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProyectosService } from './proyectos.service';
import { ProyectosController } from './proyectos.controller';
import { Proyecto, ProyectoSchema } from './schemas/proyecto.schema';
import { ProyectosRepository } from './repositories/proyectos-repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Proyecto.name, schema: ProyectoSchema }]),
  ],
  controllers: [ProyectosController],
  providers: [
    ProyectosService,
    {
      provide: 'ProyectosRepositoryInterface',
      useClass: ProyectosRepository,
    },
  ],
  exports: [ProyectosService],
})
export class ProyectosModule {}