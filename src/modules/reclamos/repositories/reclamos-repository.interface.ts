import { Usuario } from 'src/modules/usuario/schema/usuario.schema';
import { Reclamo, ReclamoDocumentType } from '../schemas/reclamo.schema';
import { Subarea } from 'src/modules/subareas/schemas/subarea.schema';

export interface IReclamosRepository {
  findOne(id: string): Promise<ReclamoDocumentType | null>;
  autoasignar(
    reclamo: Reclamo,
    empleado: Usuario,
    subarea: Subarea,
  ): Promise<void>;
}
