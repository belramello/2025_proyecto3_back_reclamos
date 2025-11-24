import {
  HistorialEstado,
  HistorialEstadoDocumentType,
} from '../schema/historial-estado.schema';

export interface IHistorialEstadoRepository {
  create(historial: Partial<HistorialEstado>): Promise<HistorialEstado>;
  findOne(id: string): Promise<HistorialEstadoDocumentType>;
  cerrarHistorial(historial: HistorialEstadoDocumentType): Promise<void>;
}
