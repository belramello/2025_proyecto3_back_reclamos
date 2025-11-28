import { CrearAsignacionDto } from '../dto/create-asignacion.dto';
import { HistorialAsignacion } from '../schemas/historial-asignacion.schema';

export interface IAsignacionStrategy {
  tipo: string;
  crearHistorial(data: CrearAsignacionDto): HistorialAsignacion;
}
