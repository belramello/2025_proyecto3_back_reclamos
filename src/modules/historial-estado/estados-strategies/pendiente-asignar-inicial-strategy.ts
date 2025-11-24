import { Injectable } from '@nestjs/common';
import { ICreacionHistorialStrategy } from './creacion-historial-strategy.interface';
import { TipoCreacionHistorialEnum } from '../enums/tipo-creacion-historial.enum';
import { CrearHistorialEstadoDto } from '../dto/create-historial-estado.dto';
import { HistorialEstado } from '../schema/historial-estado.schema';
import { EstadosEnum } from 'src/modules/estados/enums/estados-enum';
import { EstadosService } from 'src/modules/estados/estados.service';

@Injectable()
export class InicialPendienteAAsignarStrategy
  implements ICreacionHistorialStrategy
{
  tipo = TipoCreacionHistorialEnum.INICIAL_PENDIENTE_A_ASIGNAR;

  constructor(private readonly estadosService: EstadosService) {}

  async crearHistorial(
    data: CrearHistorialEstadoDto,
  ): Promise<Partial<HistorialEstado>> {
    const pendienteAAsignar = await this.estadosService.findOneByNombre(
      EstadosEnum.PENDIENTE_A_ASIGNAR,
    );
    return {
      reclamo: data.reclamo,
      estado: pendienteAAsignar,
    };
  }
}
