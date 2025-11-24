import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HistorialAsignacion,
  HistorialAsignacionDocumentType,
} from '../schemas/historial-asignacion.schema';
import type { IHistorialAsignacionRepository } from './historial-asignacion.repository';

export class HistorialAsignacionRepository
  implements IHistorialAsignacionRepository
{
  constructor(
    @InjectModel(HistorialAsignacion.name)
    private readonly historialAsignacionModel: Model<HistorialAsignacionDocumentType>,
  ) {}

  async create(
    historial: HistorialAsignacion,
  ): Promise<HistorialAsignacionDocumentType> {
    try {
      const historialAsignacionDoc = new this.historialAsignacionModel(
        historial,
      );
      return await historialAsignacionDoc.save();
    } catch (error) {
      throw new Error(
        `Error al crear historial de asignacion: ${error.message}`,
      );
    }
  }
}
