import { Area } from 'src/modules/areas/schemas/area.schema';
import { Reclamo } from 'src/modules/reclamos/schemas/reclamo.schema';
import { Subarea } from 'src/modules/subareas/schemas/subarea.schema';
import { Usuario } from 'src/modules/usuario/schema/usuario.schema';
import { TipoAsignacionesEnum } from '../enums/tipoAsignacionesEnum';

export class CrearAsignacionDto {
  reclamo: Reclamo;
  desdeEmpleado?: Usuario;
  desdeArea: Area;
  desdeSubarea?: Subarea;
  haciaEmpleado?: Usuario;
  haciaArea: Area;
  haciaSubarea?: Subarea;
  comentario?: string;
  tipoAsignacion: TipoAsignacionesEnum;
  historialACerrarId: string;
}
