import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ReclamoDocumentType } from '../schemas/reclamo.schema';
import { TipoReclamoDocumentType } from 'src/modules/tipo-reclamo/schemas/tipo-reclamo.schema';
import {
  Proyecto,
  ProyectoDocument,
} from 'src/modules/proyectos/schemas/proyecto.schema';
import { HistorialAsignacion } from 'src/modules/historial-asignacion/schemas/historial-asignacion.schema';
import { HistorialEstado } from 'src/modules/historial-estado/schema/historial-estado.schema';
import { RespuestaCreateReclamoDto } from '../dto/respuesta-create-reclamo.dto';
import { ReclamoResponseDto } from '../dto/respuesta-reclamo.dto';
import { RespuestaFindAllPaginatedReclamoDTO } from '../dto/respuesta-find-all-paginated.dto';
import { RespuestaHistorialReclamoDto } from '../dto/respuesta-historial-reclamo.dto';
import { HistorialAsignacionesMapper } from 'src/modules/historial-asignacion/mappers/historial-asignaciones-mapper';
import { HistorialEstadosMapper } from 'src/modules/historial-estado/mappers/historial-estado-mapper';
import { ReclamoEnMovimientoDto } from '../dto/reclamo-en-movimiento.dto';
import { ReclamosDelClienteDto } from '../dto/reclamos-del-cliente.dto';
import { RespuestaCerrarReclamoDto } from '../dto/respuesta-cerrar-reclamo.dto';

@Injectable()
export class ReclamosMapper {
  constructor(
    private readonly historialAsignacionesMapper: HistorialAsignacionesMapper,
    private readonly historialEstadosMapper: HistorialEstadosMapper,
  ) {}

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
    return {
      nroTicket: reclamo.nroTicket,
      titulo: reclamo.titulo,
      tipoReclamo: this.mapTipoReclamo(reclamo.tipoReclamo),
      prioridad: reclamo.prioridad,
      nivelCriticidad: reclamo.nivelCriticidad,
      proyecto: this.mapProyecto(reclamo.proyecto),
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

  toRespuestaHistorialReclamoDto(
    historialReclamo: ReclamoDocumentType,
  ): RespuestaHistorialReclamoDto {
    return {
      nroTicket: historialReclamo.nroTicket,
      titulo: historialReclamo.titulo,
      prioridad: historialReclamo.prioridad,
      nivelCriticidad: historialReclamo.nivelCriticidad,
      descripcion: historialReclamo.descripcion,
      historialAsignaciones:
        this.historialAsignacionesMapper.toHistorialAsignacionesDtos(
          historialReclamo.historialAsignaciones,
        ),
      historialEstados: this.historialEstadosMapper.toHistorialEstadosDtos(
        historialReclamo.historialEstados,
      ),
    };
  }

  toReclamoEnMovimientoDto(reclamo: any): ReclamoEnMovimientoDto {
    console.log(reclamo.clienteDetalle);
    return {
      reclamoId: String(reclamo._id),
      reclamoNroTicket: reclamo.nroTicket,
      reclamoTitulo: reclamo.titulo,
      nombreProyecto: reclamo.proyectoDetalle?.titulo || null,
      nombreApellidoCliente: reclamo.clienteDetalle?.nombre || null,
      fechaHoraInicioAsignacion: reclamo.asig?.fechaAsignacion,
      nivelCriticidad: reclamo.nivelCriticidad,
      prioridad: reclamo.prioridad,
      nombreEstado: reclamo.estadoDetalle?.nombre,
      tipoAsignacion: reclamo.asig?.tipoAsignacion,
      subAreaAsignada: reclamo.asig?.desdeSubarea || reclamo.asig?.haciaSubarea || null,
    };
  }

  toReclamoEnMovimientoDtos(reclamos: any[]): ReclamoEnMovimientoDto[] {
    return reclamos.map((r) => this.toReclamoEnMovimientoDto(r));
  }

  private mapTipoReclamo(
    tipo: TipoReclamoDocumentType | Types.ObjectId | null | undefined,
  ): TipoReclamoDocumentType | undefined {
    if (!tipo || tipo instanceof Types.ObjectId) return undefined;
    return tipo;
  }

  private mapProyecto(
    proyecto: Proyecto | ProyectoDocument | Types.ObjectId | null | undefined,
  ): ProyectoDocument | undefined {
    if (!proyecto || proyecto instanceof Types.ObjectId) return undefined;
    return proyecto as ProyectoDocument;
  }

  toReclamoDelClienteDto(reclamo: ReclamoDocumentType): ReclamosDelClienteDto {
    return {
      _id: String(reclamo._id),
      nroTicket: reclamo.nroTicket,
      titulo: reclamo.titulo,
      tipoReclamo: this.mapTipoReclamo(reclamo.tipoReclamo),
      prioridad: reclamo.prioridad,
      nivelCriticidad: reclamo.nivelCriticidad,
      proyecto: this.mapProyecto(reclamo.proyecto),
      descripcion: reclamo.descripcion,
      resumenResolucion: reclamo.resumenResolucion,
      historialEstado: this.historialEstadosMapper.toHistorialEstadosDtos(
        reclamo.historialEstados,
      ),
      historialAsignacion:
        this.historialAsignacionesMapper.toHistorialAsignacionesDtos(
          reclamo.historialAsignaciones,
        ),
    };
  }

  toReclamosDelClienteList(
    reclamos: ReclamoDocumentType[],
  ): ReclamosDelClienteDto[] {
    return reclamos.map((r) => this.toReclamoDelClienteDto(r));
  }

  toRespuestaCerrarReclamoDto(
    reclamo: ReclamoDocumentType,
  ): RespuestaCerrarReclamoDto {
    return {
      _id: String(reclamo._id),
      nroTicket: reclamo.nroTicket,
      tipoReclamo: this.mapTipoReclamo(reclamo.tipoReclamo),
      prioridad: reclamo.prioridad,
      nivelCriticidad: reclamo.nivelCriticidad,
      resumenResolucion: reclamo.resumenResolucion,
    };
  }
}
