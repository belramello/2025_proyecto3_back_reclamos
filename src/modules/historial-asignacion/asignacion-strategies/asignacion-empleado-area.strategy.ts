import { Injectable } from '@nestjs/common';
import { IAsignacionStrategy } from './asignacion-strategy.interface';
import { HistorialAsignacion } from '../schemas/historial-asignacion.schema';
import { CrearAsignacionDto } from '../dto/create-asignacion.dto';
import { TipoAsignacionesEnum } from '../enums/tipoAsignacionesEnum';

@Injectable()
export class AsignacionEmpleadoAreaStrategy implements IAsignacionStrategy {
  tipo = TipoAsignacionesEnum.DE_EMPLEADO_A_AREA;

  crearHistorial(data: CrearAsignacionDto): HistorialAsignacion {
    return {
      reclamo: data.reclamo,
      desdeArea: data.desdeArea,
      haciaArea: data.haciaArea,
      desdeSubarea: data.desdeSubarea,
      deEmpleado: data.desdeEmpleado,
      comentario: data.comentario,
      tipoAsignacion: TipoAsignacionesEnum.DE_EMPLEADO_A_AREA,
    };
  }
}
