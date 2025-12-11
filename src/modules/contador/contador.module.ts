// src/modules/contadores/contador.module.ts

import { Module } from '@nestjs/common';
import { ContadorService } from './contador.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Counter,CounterSchema} from './schemas/contador.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Counter.name, schema: CounterSchema }
    ]),
  ],
  controllers: [],
  providers: [ContadorService],
  exports: [ContadorService], 
})
export class ContadorModule {}