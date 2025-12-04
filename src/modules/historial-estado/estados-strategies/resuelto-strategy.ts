import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ICreacionHistorialStrategy } from './creacion-historial-strategy.interface';
import { TipoCreacionHistorialEnum } from '../enums/tipo-creacion-historial.enum';
import { CrearHistorialEstadoDto } from '../dto/create-historial-estado.dto';
import { HistorialEstado } from '../schema/historial-estado.schema';
import { HistorialEstadoService } from '../historial-estado.service';
import { EstadosEnum } from 'src/modules/estados/enums/estados-enum';
import { EstadosService } from 'src/modules/estados/estados.service';

@Injectable()
export class ResueltoStrategy implements ICreacionHistorialStrategy {
  tipo = TipoCreacionHistorialEnum.RESUELTO;
  constructor(
    @Inject(forwardRef(() => HistorialEstadoService))
    private readonly historialEstadoService: HistorialEstadoService,
    private readonly estadosService: EstadosService,
  ) {}

  async crearHistorial(
    data: CrearHistorialEstadoDto,
  ): Promise<Partial<HistorialEstado>> {
    if (!data.historiaACerrarId) {
      throw new Error('No se ha enviado el historial de estado a cerrar.');
    }
    await this.cerrarHistorial(data.historiaACerrarId);
    const resuelto = await this.estadosService.findOneByNombre(
      EstadosEnum.RESUELTO,
    );
    return {
      reclamo: data.reclamo,
      estado: resuelto,
      usuarioResponsable: data.usuarioResponsable,
    };
  }

  async cerrarHistorial(historialId: string): Promise<void> {
    return await this.historialEstadoService.cerrarHistorial(historialId);
  }
}
