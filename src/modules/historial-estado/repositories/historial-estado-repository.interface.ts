import {
  HistorialEstado,
  HistorialEstadoDocumentType,
} from '../schema/historial-estado.schema';

export interface IHistorialEstadoRepository {
  create(
    historial: Partial<HistorialEstado>,
  ): Promise<HistorialEstadoDocumentType>;
  findOne(id: string): Promise<HistorialEstadoDocumentType>;
  cerrarHistorial(historial: HistorialEstadoDocumentType): Promise<void>;
}
