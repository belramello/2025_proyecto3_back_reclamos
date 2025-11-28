import {
  HistorialAsignacion,
  HistorialAsignacionDocumentType,
} from '../schemas/historial-asignacion.schema';

export interface IHistorialAsignacionRepository {
  create(
    historial: HistorialAsignacion,
  ): Promise<HistorialAsignacionDocumentType>;
  cerrarHistorial(historialId: string): Promise<void>;
}
