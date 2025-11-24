import { Usuario } from 'src/modules/usuario/schema/usuario.schema';
import { TipoCreacionHistorialEnum } from '../enums/tipo-creacion-historial.enum';
import { Reclamo } from 'src/modules/reclamos/schemas/reclamo.schema';

export class CrearHistorialEstadoDto {
  reclamo: Reclamo;
  usuarioResponsable?: Usuario;
  historiaACerrarId?: string;
  tipo: TipoCreacionHistorialEnum;
}
