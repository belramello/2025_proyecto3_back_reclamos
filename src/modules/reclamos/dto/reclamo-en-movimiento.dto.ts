import { EstadosEnum } from 'src/modules/estados/enums/estados-enum';
import { Prioridad } from 'src/modules/historial-asignacion/enums/PrioridadEnum';
import { TipoAsignacionesEnum } from 'src/modules/historial-asignacion/enums/tipoAsignacionesEnum';

export class ReclamoEnMovimientoDto {
  reclamoId: string;
  reclamoNroTicket: string;
  reclamoTitulo: string;
  nombreProyecto: string;
  nombreApellidoCliente?: string | null;
  fechaHoraInicioAsignacion: Date;
  nivelCriticidad: number;
  prioridad: Prioridad;
  nombreEstado: EstadosEnum;
  tipoAsignacion: TipoAsignacionesEnum;
  subAreaAsignada?: string | null;
}
