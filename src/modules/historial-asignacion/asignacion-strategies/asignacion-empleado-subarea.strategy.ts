import { Injectable } from '@nestjs/common';
import { IAsignacionStrategy } from './asignacion-strategy.interface';
import { HistorialAsignacion } from '../schemas/historial-asignacion.schema';
import { CrearAsignacionDto } from '../dto/create-asignacion.dto';
import { TipoAsignacionesEnum } from '../enums/tipoAsignacionesEnum';

@Injectable()
export class AsignacionEmpleadoSubareaStrategy implements IAsignacionStrategy {
  tipo = TipoAsignacionesEnum.DE_EMPLEADO_A_SUBAREA;

  crearHistorial(data: CrearAsignacionDto): HistorialAsignacion {
    return {
      reclamo: data.reclamo,
      desdeArea: data.desdeArea,
      haciaArea: data.haciaArea,
      desdeSubarea: data.desdeSubarea,
      haciaSubarea: data.haciaSubarea,
      deEmpleado: data.desdeEmpleado,
      tipoAsignacion: TipoAsignacionesEnum.DE_EMPLEADO_A_SUBAREA,
    };
  }
}
