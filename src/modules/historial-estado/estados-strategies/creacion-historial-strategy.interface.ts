import { CrearHistorialEstadoDto } from '../dto/create-historial-estado.dto';
import { TipoCreacionHistorialEnum } from '../enums/tipo-creacion-historial.enum';
import { HistorialEstado } from '../schema/historial-estado.schema';

export interface ICreacionHistorialStrategy {
  tipo: TipoCreacionHistorialEnum;
  crearHistorial(
    data: CrearHistorialEstadoDto,
  ): Promise<Partial<HistorialEstado>>;
  cerrarHistorial?(historialId: string): Promise<void>;
}
