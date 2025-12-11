import { EstadosMapper } from 'src/modules/estados/mappers/estado-mapper';
import { HistorialEstadoDto } from '../dto/historial-estado.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HistorialEstadosMapper {
  constructor(private readonly estadosMapper: EstadosMapper) {}

  toHistorialEstadosDtos(historiales: any[]): HistorialEstadoDto[] {
    return historiales.map((historialEstado) => {
      return this.toHistorialEstadoDto(historialEstado);
    });
  }

  toHistorialEstadoDto(historialEstado: any): HistorialEstadoDto {
    console.log(
      'historial Estado en mapper de historial estado',
      historialEstado,
    );
    return {
      id: String(historialEstado._id),
      fechaHoraInicio: historialEstado.fechaHoraInicio,
      fechaHoraFin: historialEstado.fechaHoraFin,
      estado: this.estadosMapper.toEstadoDto(historialEstado.estado),
    };
  }
}
