import { Injectable } from '@nestjs/common';
import { IAsignacionStrategy } from './asignacion-strategy.interface';
import { HistorialAsignacion } from '../schemas/historial-asignacion.schema';
import { CrearAsignacionDto } from '../dto/create-asignacion.dto';
import { TipoAsignacionesEnum } from '../enums/tipoAsignacionesEnum';

@Injectable()
export class AsignacionEmpleadoEmpleadoStrategy implements IAsignacionStrategy {
  tipo = TipoAsignacionesEnum.DE_EMPLEADO_A_EMPLEADO;

  crearHistorial(data: CrearAsignacionDto): HistorialAsignacion {
    return {
      reclamo: data.reclamo,
      desdeArea: data.desdeArea,
      haciaArea: data.haciaArea,
      desdeSubarea: data.desdeSubarea,
      haciaSubarea: data.haciaSubarea,
      deEmpleado: data.desdeEmpleado,
      haciaEmpleado: data.haciaEmpleado,
      comentario: data.comentario,
      tipoAsignacion: TipoAsignacionesEnum.DE_EMPLEADO_A_EMPLEADO,
    };
  }
}
