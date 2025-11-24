import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IHistorialEstadoRepository } from './historial-estado-repository.interface';
import {
  HistorialEstado,
  HistorialEstadoDocumentType,
} from '../schema/historial-estado.schema';
import { ReclamosService } from 'src/modules/reclamos/reclamos.service';
import { forwardRef, Inject } from '@nestjs/common';

export class HistorialEstadoRepository implements IHistorialEstadoRepository {
  constructor(
    @InjectModel(HistorialEstado.name)
    private readonly historialEstadoModel: Model<HistorialEstadoDocumentType>,
    @Inject(forwardRef(() => ReclamosService))
    private readonly reclamoService: ReclamosService,
  ) {}

  async create(
    historial: Partial<HistorialEstado>,
  ): Promise<HistorialEstadoDocumentType> {
    try {
      const historialEstadoDoc = new this.historialEstadoModel({
        ...historial,
        fechaHoraInicio: historial.fechaHoraInicio ?? new Date(),
      });
      //No tengo que popular el historial que está llegando.
      const historialDoc = await historialEstadoDoc.save();
      await this.reclamoService.actualizarHistorialEstadoActual(
        historialDoc,
        historialDoc.reclamo.toString(),
      );
      return historialDoc;
    } catch (error) {
      throw new Error(
        `Error al crear historial de asignacion: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<HistorialEstadoDocumentType> {
    try {
      const historial = await this.historialEstadoModel.findById(id).exec();
      if (!historial) {
        throw new Error(`Historial de estado no encontrado: ${id}`);
      }
      return historial;
    } catch (error) {
      throw new Error(`Error al buscar historial de estado: ${error.message}`);
    }
  }

  async cerrarHistorial(historial: HistorialEstadoDocumentType): Promise<void> {
    try {
      historial.fechaHoraFin = new Date();
      await historial.save();
      return;
    } catch (error) {
      throw new Error(`Error al cerrar historial de estado: ${error.message}`);
    }
  }
}
