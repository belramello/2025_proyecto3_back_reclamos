import { Injectable } from '@nestjs/common';
import { Reclamo, ReclamoDocumentType } from '../schemas/reclamo.schema';
import { RespuestaHistorialReclamoDto } from '../dto/respuesta-historial-reclamo.dto';
import { HistorialAsignacionesMapper } from 'src/modules/historial-asignacion/mappers/historial-asignaciones-mapper';
import { HistorialEstadosMapper } from 'src/modules/historial-estado/mappers/historial-estado-mapper';
import { ReclamoEnMovimientoDto } from '../dto/reclamo-en-movimiento.dto';

@Injectable()
export class ReclamosMapper {
  constructor(
    private readonly historialAsignacionesMapper: HistorialAsignacionesMapper,
    private readonly historialEstadosMapper: HistorialEstadosMapper,
  ) {}

  //Añadir vinculación con proyecto y con cliente y con tipo de cliente.
  toRespuestaHistorialReclamoDto(
    historialReclamo: ReclamoDocumentType,
  ): RespuestaHistorialReclamoDto {
    return {
      nroTicket: historialReclamo.nroTicket,
      titulo: historialReclamo.titulo,
      //tipoReclamo: historialReclamo.tipoReclamo,
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
    return {
      reclamoId: String(reclamo._id),
      reclamoNroTicket: reclamo.nroTicket,
      reclamoTitulo: reclamo.titulo,
      nombreProyecto: reclamo.proyectoDetalle?.nombre || null,
      nombreApellidoCliente: reclamo.clienteDetalle
        ? `${reclamo.clienteDetalle.nombre} ${reclamo.clienteDetalle.apellido}`
        : null,
      fechaHoraInicioAsignacion: reclamo.asig?.fechaAsignacion,
      nivelCriticidad: reclamo.nivelCriticidad,
      prioridad: reclamo.prioridad,
      nombreEstado: reclamo.estadoDetalle?.nombre,
      tipoAsignacion: reclamo.asig?.tipoAsignacion,
    };
  }

  toReclamoEnMovimientoDtos(reclamos: any[]): ReclamoEnMovimientoDto[] {
    return reclamos.map((reclamo) => {
      return this.toReclamoEnMovimientoDto(reclamo);
    });
  }
}
