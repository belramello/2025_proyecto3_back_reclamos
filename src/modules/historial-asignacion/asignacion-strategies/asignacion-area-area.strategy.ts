import { Injectable } from '@nestjs/common';
import { IAsignacionStrategy } from './asignacion-strategy.interface';
import { HistorialAsignacion } from '../schemas/historial-asignacion.schema';
import { CrearAsignacionDto } from '../dto/create-asignacion.dto';
import { TipoAsignacionesEnum } from '../enums/tipoAsignacionesEnum';

@Injectable()
export class AsignacionAreaAreaStrategy implements IAsignacionStrategy {
  tipo = TipoAsignacionesEnum.DE_AREA_A_AREA;

  crearHistorial(data: CrearAsignacionDto): HistorialAsignacion {
    return {
      reclamo: data.reclamo,
      desdeArea: data.desdeArea,
      haciaArea: data.haciaArea,
      comentario: data.comentario,
      tipoAsignacion: TipoAsignacionesEnum.DE_AREA_A_AREA,
    };
  }
}
