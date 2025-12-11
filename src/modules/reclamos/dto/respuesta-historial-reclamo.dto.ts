import { HistorialAsignacionDto } from 'src/modules/historial-asignacion/dto/historial-asignacion.dto';
import { HistorialEstadoDto } from 'src/modules/historial-estado/dto/historial-estado.dto';

export class RespuestaHistorialReclamoDto {
  //imagenUrl: string[] | null;
  nroTicket: string;
  titulo: string;
  //tipoReclamo: string;
  prioridad: string;
  nivelCriticidad: number;
  descripcion?: string;
  historialAsignaciones: HistorialAsignacionDto[];
  historialEstados: HistorialEstadoDto[];
}
