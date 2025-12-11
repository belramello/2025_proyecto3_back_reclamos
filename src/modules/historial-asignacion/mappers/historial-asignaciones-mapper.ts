import { Injectable } from '@nestjs/common';
import { HistorialAsignacionDto } from '../dto/historial-asignacion.dto';
import { SubareasMapper } from 'src/modules/subareas/helpers/subareas-mapper';
import { AreasMapper } from 'src/modules/areas/helpers/areas-mapper';
import { UsersMapper } from 'src/modules/usuario/mappers/usuario.mapper';

@Injectable()
export class HistorialAsignacionesMapper {
  constructor(
    private readonly areasMapper: AreasMapper,
    private readonly subareaMapper: SubareasMapper,
    private readonly usuariosMapper: UsersMapper,
  ) {}

  toHistorialAsignacionDto(historialAsignacion: any): HistorialAsignacionDto {
    return {
      id: String(historialAsignacion._id),
      desdeArea: this.areasMapper.toAreaDtoOrNull(
        historialAsignacion.desdeArea,
      ),
      haciaArea: this.areasMapper.toAreaDtoOrNull(
        historialAsignacion.haciaArea,
      ),
      desdeSubarea: this.subareaMapper.toSubareaDtoOrNull(
        historialAsignacion.desdeSubarea,
      ),
      haciaSubarea: this.subareaMapper.toSubareaDtoOrNull(
        historialAsignacion.haciaSubarea,
      ),
      deEmpleado: this.usuariosMapper.toEmpleadoDtoOrNull(
        historialAsignacion.deEmpleado,
      ),
      haciaEmpleado: this.usuariosMapper.toEmpleadoDtoOrNull(
        historialAsignacion.haciaEmpleado,
      ),
      tipoAsignacion: historialAsignacion.tipoAsignacion,
      comentario: historialAsignacion.comentario,
      fechaAsignacion: historialAsignacion.fechaAsignacion,
      fechaHoraFin: historialAsignacion.fechaHoraFin,
    };
  }

  toHistorialAsignacionesDtos(historiales: any[]): HistorialAsignacionDto[] {
    return historiales.map((historialAsignacion) => {
      return this.toHistorialAsignacionDto(historialAsignacion);
    });
  }
}
