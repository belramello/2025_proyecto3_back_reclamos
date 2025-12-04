import { Injectable } from '@nestjs/common';
import { IAsignacionStrategy } from './asignacion-strategy.interface';
import { HistorialAsignacion } from '../schemas/historial-asignacion.schema';
import { CrearAsignacionDto } from '../dto/create-asignacion.dto';
import { TipoAsignacionesEnum } from '../enums/tipoAsignacionesEnum';

@Injectable()
export class AsignacionInicialStrategy implements IAsignacionStrategy {
  tipo = TipoAsignacionesEnum.INICIAL;

  crearHistorial(data: CrearAsignacionDto): HistorialAsignacion {
    return {
      reclamo: data.reclamo,
      haciaArea: data.haciaArea,
      tipoAsignacion: TipoAsignacionesEnum.INICIAL,
    };
  }
}
