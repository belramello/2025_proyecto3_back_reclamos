import { Module } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { EstadosController } from './estados.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Estado, EstadoSchema } from './schemas/estado.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Estado.name, schema: EstadoSchema }]),
  ],
  controllers: [EstadosController],
  providers: [EstadosService],
})
export class EstadosModule {}
