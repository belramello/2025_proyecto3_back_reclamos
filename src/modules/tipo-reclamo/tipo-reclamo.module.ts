import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoReclamoService } from './tipo-reclamo.service';
import { TipoReclamoController } from './tipo-reclamo.controller';
import { TipoReclamoSchema } from './schemas/tipo-reclamo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'TipoReclamo', schema: TipoReclamoSchema }]),
  ],
  controllers: [TipoReclamoController],
  providers: [TipoReclamoService],
})
export class TipoReclamoModule {}
