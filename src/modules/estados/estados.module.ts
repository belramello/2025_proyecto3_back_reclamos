import { Module } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { EstadosController } from './estados.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EstadoSchema } from './schemas/estado.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Estado', schema: EstadoSchema }]),
  ],
  controllers: [EstadosController],
  providers: [EstadosService],
})
export class EstadosModule {}
