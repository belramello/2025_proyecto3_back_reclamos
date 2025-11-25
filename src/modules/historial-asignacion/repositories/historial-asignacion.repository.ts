import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HistorialAsignacion,
  HistorialAsignacionDocumentType,
} from '../schemas/historial-asignacion.schema';
import type { IHistorialAsignacionRepository } from './historial-asignacion-interface.repository';

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

  async findOne(id: string): Promise<HistorialAsignacionDocumentType> {
    try {
      const historial = await this.historialAsignacionModel.findById(id).exec();
      if (!historial) {
        throw new Error(`Historial de asignacion no encontrado: ${id}`);
      }
      return historial;
    } catch (error) {
      throw new Error(
        `Error al buscar historial de asignacion: ${error.message}`,
      );
    }
  }

  async cerrarHistorial(historialId: string): Promise<void> {
    try {
      const historial = await this.findOne(historialId);
      historial.fechaHoraFin = new Date();
      await historial.save();
      return;
    } catch (error) {
      throw new Error(`Error al cerrar historial de estado: ${error.message}`);
    }
  }
}
