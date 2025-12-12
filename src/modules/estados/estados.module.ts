import { Module } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Estado, EstadoSchema } from './schemas/estado.schema';
import { EstadosRepository } from './repositories/estados-repository';
import { EstadosMapper } from './mappers/estado-mapper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Estado.name, schema: EstadoSchema }]),
  ],
  providers: [
    EstadosService,
    EstadosMapper,
    {
      provide: 'IEstadosRepository',
      useClass: EstadosRepository,
    },
  ],

  exports: [EstadosService, EstadosMapper],
})
export class EstadosModule {}
