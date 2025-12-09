<<<<<<< HEAD
import { TipoReclamo } from 'src/modules/tipo-reclamo/schemas/tipo-reclamo.schema';
import { HistorialAsignacion } from 'src/modules/historial-asignacion/schemas/historial-asignacion.schema';
import { HistorialEstado } from 'src/modules/historial-estado/schema/historial-estado.schema';
import { Proyecto } from 'src/modules/proyectos/schemas/proyecto.schema';
import { Usuario } from 'src/modules/usuario/schema/usuario.schema';
import { Area } from 'src/modules/areas/schemas/area.schema';
export enum Prioridad {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
}

export class RespuestaReclamoDto {
  _id: string;
  nroTicket: string;

  tipoReclamo: TipoReclamo;
  prioridad: Prioridad;
  nivelCriticidad: number;

  cliente: Usuario;
  proyecto: Proyecto;
  areaAsignada: Area;

  descripcion?: string;
  imagenes?: string[];

  estadoActual: HistorialEstado;

  historialAsignaciones: HistorialAsignacion[];
  historialEstados: HistorialEstado[];

  ultimoHistorialAsignacion?: HistorialAsignacion;
  ultimoHistorialEstado?: HistorialEstado;

  fechaCreacion: Date;
  fechaEliminacion?: Date;
=======
export class ReclamoResponseDto {
  nroTicket: string;           
  titulo: string;
  tipoReclamo?: string;
  prioridad: string;
  nivelCriticidad: number;
  proyecto: string;
  descripcion?: string;
  imagenUrl?: string[];
  resumenResolucion?: string;

>>>>>>> bel
}
