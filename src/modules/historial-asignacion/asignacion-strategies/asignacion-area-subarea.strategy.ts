import { Injectable } from '@nestjs/common';
import { IAsignacionStrategy } from './asignacion-strategy.interface';
import { HistorialAsignacion } from '../schemas/historial-asignacion.schema';
import { CrearAsignacionDto } from '../dto/create-asignacion.dto';
import { TipoAsignacionesEnum } from '../enums/tipoAsignacionesEnum';

@Injectable()
export class AsignacionAreaSubareaStrategy implements IAsignacionStrategy {
  tipo = TipoAsignacionesEnum.DE_AREA_A_SUBAREA;

  crearHistorial(data: CrearAsignacionDto): HistorialAsignacion {
    return {
      reclamo: data.reclamo,
      desdeArea: data.desdeArea,
      haciaArea: data.haciaArea,
      haciaSubarea: data.haciaSubarea,
      comentario: data.comentario,
      tipoAsignacion: TipoAsignacionesEnum.DE_AREA_A_SUBAREA,
    };
  }
}
