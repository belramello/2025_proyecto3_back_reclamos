import { Injectable } from '@nestjs/common';
import { IAsignacionStrategy } from './asignacion-strategy.interface';
import { HistorialAsignacion } from '../schemas/historial-asignacion.schema';
import { CrearAsignacionDto } from '../dto/create-asignacion.dto';
import { TipoAsignacionesEnum } from '../enums/tipoAsignacionesEnum';

@Injectable()
export class AsignacionAreaEmpleadoStrategy implements IAsignacionStrategy {
  tipo = TipoAsignacionesEnum.DE_AREA_A_EMPLEADO;

  crearHistorial(data: CrearAsignacionDto): HistorialAsignacion {
    return {
      reclamo: data.reclamo,
      desdeArea: data.desdeArea,
      haciaArea: data.haciaArea,
      haciaSubarea: data.haciaSubarea,
      haciaEmpleado: data.haciaEmpleado,
      tipoAsignacion: TipoAsignacionesEnum.DE_AREA_A_EMPLEADO,
    };
  }
}
