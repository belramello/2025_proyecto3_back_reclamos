import { Prioridad } from '../../historial-asignacion/enums/PrioridadEnum';
import { TipoReclamo } from '../../tipo-reclamo/schemas/tipo-reclamo.schema';

export interface RespuestaCerrarReclamoDto {
  _id: string;
  nroTicket: string;
  tipoReclamo?: TipoReclamo;
  prioridad?: Prioridad;
  nivelCriticidad?: number;
  resumenResolucion?: string;
}
