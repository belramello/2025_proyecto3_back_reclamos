import { Module } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Estado, EstadoSchema } from './schemas/estado.schema';
import { EstadosRepository } from './repositories/estados-repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Estado.name, schema: EstadoSchema }]),
  ],
  providers: [
    EstadosService,
    {
      provide: 'IEstadosRepository',
      useClass: EstadosRepository,
    },
  ],
  exports: [EstadosService],
})
export class EstadosModule {}
