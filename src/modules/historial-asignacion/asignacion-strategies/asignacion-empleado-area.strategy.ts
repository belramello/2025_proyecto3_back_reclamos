import { Injectable } from '@nestjs/common';
import { IAsignacionStrategy } from './asignacion-strategy.interface';
import { HistorialAsignacion } from '../schemas/historial-asignacion.schema';
import { CrearAsignacionDto } from '../dto/create-asignacion.dto';
import { TipoAsignacionesEnum } from '../enums/tipoAsignacionesEnum';
import { MailService } from 'src/modules/mail/mail.service';

@Injectable()
export class AsignacionEmpleadoAreaStrategy implements IAsignacionStrategy {
  tipo = TipoAsignacionesEnum.DE_EMPLEADO_A_AREA;
  requiereCierreHistorial = true;
  requiereNotificacionEmpleado = false;

  constructor(private readonly mailService: MailService) {}

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
