// src/modules/contadores/counter.service.ts (o similar)

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter,CounterDocument } from './schemas/contador.schema';

@Injectable()
export class ContadorService {
  constructor(
    @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
  ) {}

  async getNextSequenceValue(sequenceName: string): Promise<number> {
    const counter = await this.counterModel.findByIdAndUpdate(
      sequenceName,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();

    if (!counter) {
        throw new Error(`No se pudo obtener el contador para la secuencia: ${sequenceName}`);
    }

    return counter.seq;
  }
}