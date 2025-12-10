import { AreaDto } from 'src/modules/areas/dto/area-dto';
import { SubareaDto } from 'src/modules/subareas/dto/subarea-de-usuario.dto';
import { EmpleadoDto } from 'src/modules/usuario/dto/empleado-de-subarea.dto';

export class HistorialAsignacionDto {
  id: string;
  desdeArea?: AreaDto | null;
  haciaArea?: AreaDto | null;
  desdeSubarea?: SubareaDto | null;
  haciaSubarea?: SubareaDto | null;
  deEmpleado?: EmpleadoDto | null;
  haciaEmpleado?: EmpleadoDto | null;
  tipoAsignacion: string;
  comentario?: string | null;
  fechaAsignacion: Date;
  fechaHoraFin?: Date | null;
}
