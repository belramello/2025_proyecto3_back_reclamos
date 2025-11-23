import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReclamosService } from './reclamos.service';
import { ReclamosController } from './reclamos.controller';
import { Reclamo, ReclamoSchema } from './schemas/reclamo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reclamo.name, schema: ReclamoSchema }]),
  ],
  controllers: [ReclamosController],
  providers: [ReclamosService],
})
export class ReclamosModule {}
