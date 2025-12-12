import { Injectable } from '@nestjs/common';
import { IAsignacionStrategy } from './asignacion-strategy.interface';
import { HistorialAsignacion } from '../schemas/historial-asignacion.schema';
import { CrearAsignacionDto } from '../dto/create-asignacion.dto';
import { TipoAsignacionesEnum } from '../enums/tipoAsignacionesEnum';
import { MailService } from 'src/modules/mail/mail.service';

@Injectable()
export class AsignacionEmpleadoEmpleadoStrategy implements IAsignacionStrategy {
  tipo = TipoAsignacionesEnum.DE_EMPLEADO_A_EMPLEADO;
  requiereCierreHistorial = true;
  requiereNotificacionEmpleado = true;

  constructor(private readonly mailService: MailService) {}

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

  async notificarAsignacionEmpleado(
    email: string,
    nroDeTicket: string,
  ): Promise<void> {
    return await this.mailService.sendAsignacionEmpleado(email, nroDeTicket);
  }
}
