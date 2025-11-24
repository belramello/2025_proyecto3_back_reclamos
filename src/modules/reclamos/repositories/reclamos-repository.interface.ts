import { Usuario } from 'src/modules/usuario/schema/usuario.schema';
import { Reclamo, ReclamoDocumentType } from '../schemas/reclamo.schema';
import { Subarea } from 'src/modules/subareas/schemas/subarea.schema';
import { HistorialEstado } from 'src/modules/historial-estado/schema/historial-estado.schema';

export interface IReclamosRepository {
  findOne(id: string): Promise<ReclamoDocumentType | null>;
  autoasignar(
    reclamo: ReclamoDocumentType,
    empleado: Usuario,
    subarea: Subarea,
  ): Promise<void>;
  actualizarHistorialEstadoActual(
    historial: HistorialEstado,
    reclamo: Reclamo,
  ): Promise<void>;
}
