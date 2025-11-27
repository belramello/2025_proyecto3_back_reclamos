import { Usuario } from 'src/modules/usuario/schema/usuario.schema';
import { ReclamoDocumentType } from '../schemas/reclamo.schema';
import { Subarea } from 'src/modules/subareas/schemas/subarea.schema';

export interface IReclamosRepository {
  findOne(id: string): Promise<ReclamoDocumentType | null>;
  autoasignar(
    reclamo: ReclamoDocumentType,
    empleado: Usuario,
    subarea: Subarea,
  ): Promise<void>;
  actualizarHistorialEstadoActual(
    historialId: string,
    reclamo: ReclamoDocumentType,
  );
  asignarReclamoASubarea(
    reclamo: ReclamoDocumentType,
    subarea: Subarea,
  ): Promise<void>;
  asignarReclamoAEmpleado(
    reclamo: ReclamoDocumentType,
    encargado: Usuario,
    subareaDeEmpleado: Subarea,
    haciaEmpleado: Usuario,
  );
}
