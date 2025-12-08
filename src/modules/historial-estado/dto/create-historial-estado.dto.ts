import { Usuario } from '../../../modules/usuario/schema/usuario.schema';
import { TipoCreacionHistorialEnum } from '../enums/tipo-creacion-historial.enum';
import { Reclamo } from '../../../modules/reclamos/schemas/reclamo.schema';

export class CrearHistorialEstadoDto {
  reclamo: Reclamo;
  usuarioResponsable?: Usuario;
  historiaACerrarId?: string;
  tipo: TipoCreacionHistorialEnum;
}
