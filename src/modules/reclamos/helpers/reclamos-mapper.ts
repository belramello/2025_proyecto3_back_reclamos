import { Injectable } from '@nestjs/common';
import { ReclamoDocumentType } from '../schemas/reclamo.schema';
import { RespuestaHistorialReclamoDto } from '../dto/respuesta-historial-reclamo.dto';
import { HistorialAsignacionesMapper } from 'src/modules/historial-asignacion/mappers/historial-asignaciones-mapper';
import { HistorialEstadosMapper } from 'src/modules/historial-estado/mappers/historial-estado-mapper';

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

  /* TERMINAR CUANDO ESTE LO DE PROYECTO Y TODAS LAS RELACIONES CON RECLAMO
  toReclamosAsignadosDto(reclamos: ReclamoDocumentType[]): ReclamoAsignadoDto[] {
    //return reclamos.map((reclamo) => {
    
  }
  toReclamoAsignadoDto(reclamo: Reclamo): ReclamoAsignadoDto{
    return {
        reclamoId: String(reclamo._id),
        reclamoTitulo: reclamo.titulo,
        nombreProyecto: reclamo.proyecto,
        nombreApellidoCliente: reclamo.nombreApellidoCliente,
        fechaHoraInicioAsignacion: reclamo.fechaHoraInicioAsignacion,
        tipoAsignacion: reclamo.tipoAsignacion,
    }
         }
        */
}
