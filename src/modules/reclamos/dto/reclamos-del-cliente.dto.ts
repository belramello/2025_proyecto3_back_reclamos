import { TipoReclamo } from '../../tipo-reclamo/schemas/tipo-reclamo.schema';
import { Proyecto } from '../../proyectos/schemas/proyecto.schema';
import { HistorialAsignacionDto } from '../../historial-asignacion/dto/historial-asignacion.dto';
import { HistorialEstadoDto } from '../../historial-estado/dto/historial-estado.dto';
//Repository
export class ReclamoPobladoDelCliente {
  nroTicket: string;
  titulo: string;
  tipoReclamo?: TipoReclamo | undefined;
  prioridad: string;
  nivelCriticidad: number;
  proyecto: Proyecto | undefined;
  descripcion?: string;
  resumenResolucion?: string;
  historialEstado: HistorialEstadoDto[];
  historialAsignaciones?: HistorialAsignacionDto[];
}

//Controller
export class ReclamosDelClienteDto {
  nroTicket: string;
  titulo: string;
  tipoReclamo?: TipoReclamo | undefined;
  prioridad: string;
  nivelCriticidad: number;
  proyecto: Proyecto | undefined;
  descripcion?: string;
  resumenResolucion?: string;
  historialEstado: HistorialEstadoDto[];
  historialAsignacion: HistorialAsignacionDto[];
}
