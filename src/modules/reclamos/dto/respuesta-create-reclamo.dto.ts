import { TipoReclamo } from 'src/modules/tipo-reclamo/schemas/tipo-reclamo.schema';
import { HistorialAsignacion } from 'src/modules/historial-asignacion/schemas/historial-asignacion.schema';
import { HistorialEstado } from 'src/modules/historial-estado/schema/historial-estado.schema';
import { Proyecto } from 'src/modules/proyectos/schemas/proyecto.schema';
export enum Prioridad {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
}

export class RespuestaCreateReclamoDto {
  _id: string;
  nroTicket: string;

  tipoReclamo?: TipoReclamo;
  prioridad?: Prioridad;
  nivelCriticidad?: number;

  historialAsignaciones: HistorialAsignacion[];
  historialEstados: HistorialEstado[];

  ultimoHistorialAsignacion?: HistorialAsignacion;
  ultimoHistorialEstado?: HistorialEstado;

  proyecto?: Proyecto;

  descripcion?: string;
  imagenUrl?: string[];
  resumenResolucion?: string;

  fechaCreacion: Date;
  fechaEliminacion?: Date;
}
