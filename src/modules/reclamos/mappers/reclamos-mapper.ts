import { Injectable } from '@nestjs/common';
import { Types, Document } from 'mongoose';
import { ReclamoDocumentType } from '../schemas/reclamo.schema';
import {
  TipoReclamo,
  TipoReclamoDocumentType,
} from 'src/modules/tipo-reclamo/schemas/tipo-reclamo.schema';
import {
  Proyecto,
  ProyectoDocument,
} from 'src/modules/proyectos/schemas/proyecto.schema';
import { HistorialAsignacion } from 'src/modules/historial-asignacion/schemas/historial-asignacion.schema';
import { HistorialEstado } from 'src/modules/historial-estado/schema/historial-estado.schema';
import { RespuestaCreateReclamoDto } from '../dto/respuesta-create-reclamo.dto';
import { ReclamoResponseDto } from '../dto/respuesta-reclamo.dto';
import { RespuestaFindAllPaginatedReclamoDTO } from '../dto/respuesta-find-all-paginated.dto';

type TipoReclamoReference =
  | Types.ObjectId
  | (TipoReclamo & Document)
  | TipoReclamo
  | null
  | undefined;

type ProyectoReference =
  | Types.ObjectId
  | (Proyecto & Document)
  | Proyecto
  | null
  | undefined;

@Injectable()
export class ReclamosMapper {
  toRespuestaCreateReclamoDto(
    reclamo: ReclamoDocumentType,
  ): RespuestaCreateReclamoDto {
    return {
      _id: String(reclamo._id),
      nroTicket: reclamo.nroTicket,
      tipoReclamo: this.mapTipoReclamo(reclamo.tipoReclamo),
      prioridad: reclamo.prioridad,
      nivelCriticidad: reclamo.nivelCriticidad,
      historialAsignaciones:
        (reclamo.historialAsignaciones as HistorialAsignacion[]) ?? [],
      historialEstados: (reclamo.historialEstados as HistorialEstado[]) ?? [],
      ultimoHistorialAsignacion:
        (reclamo.ultimoHistorialAsignacion as HistorialAsignacion) ?? undefined,
      ultimoHistorialEstado:
        (reclamo.ultimoHistorialEstado as HistorialEstado) ?? undefined,
      proyecto: this.mapProyecto(reclamo.proyecto),
      descripcion: reclamo.descripcion,
      imagenUrl: reclamo.imagenUrl,
      resumenResolucion: reclamo.resumenResolucion,
      fechaCreacion: reclamo.fechaCreacion,
      fechaEliminacion: reclamo.fechaEliminacion,
    };
  }

  toReclamoResponseDto(reclamo: ReclamoDocumentType): ReclamoResponseDto {
    const mappedTipoReclamo = this.mapTipoReclamo(reclamo.tipoReclamo);
    const mappedProyecto = this.mapProyecto(reclamo.proyecto);
    return {
      nroTicket: reclamo.nroTicket,
      titulo: reclamo.titulo,
      tipoReclamo: mappedTipoReclamo,
      prioridad: reclamo.prioridad,
      nivelCriticidad: reclamo.nivelCriticidad,
      proyecto: mappedProyecto,
      descripcion: reclamo.descripcion,
      imagenUrl: reclamo.imagenUrl,
      resumenResolucion: reclamo.resumenResolucion,
    };
  }

  toReclamosResponseList(
    reclamos: ReclamoDocumentType[],
  ): ReclamoResponseDto[] {
    return reclamos.map((r) => this.toReclamoResponseDto(r));
  }

  toRespuestaFindAllPaginatedReclamoDto(paginated: {
    reclamos: ReclamoDocumentType[];
    total: number;
    page: number;
    lastPage: number;
  }): RespuestaFindAllPaginatedReclamoDTO {
    return {
      reclamos: this.toReclamosResponseList(paginated.reclamos),
      total: paginated.total,
      page: paginated.page,
      lastPage: paginated.lastPage,
    };
  }

  private mapTipoReclamo(
    tipo: TipoReclamoReference,
  ): TipoReclamoDocumentType | undefined {
    if (!tipo || tipo instanceof Types.ObjectId) return undefined;
    return tipo as TipoReclamoDocumentType;
  }

  private mapProyecto(
    proyecto: ProyectoReference,
  ): ProyectoDocument | undefined {
    if (!proyecto || proyecto instanceof Types.ObjectId) return undefined;
    return proyecto as ProyectoDocument;
  }
}
