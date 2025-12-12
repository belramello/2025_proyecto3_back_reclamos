import { Area } from '../../../modules/areas/schemas/area.schema';
import { Reclamo } from '../../../modules/reclamos/schemas/reclamo.schema';
import { Subarea } from '../../../modules/subareas/schemas/subarea.schema';
import { Usuario } from '../../../modules/usuario/schema/usuario.schema';
import { TipoAsignacionesEnum } from '../enums/tipoAsignacionesEnum';

export class CrearAsignacionDto {
  reclamo: Reclamo;
  desdeEmpleado?: Usuario;
  desdeArea?: Area;
  desdeSubarea?: Subarea;
  haciaEmpleado?: Usuario;
  haciaArea: Area;
  haciaSubarea?: Subarea;
  comentario?: string;
  tipoAsignacion: TipoAsignacionesEnum;
  historialACerrarId?: string;
}
