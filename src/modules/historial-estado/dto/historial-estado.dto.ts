import { EstadoDto } from 'src/modules/estados/dto/estado.dto';

export class HistorialEstadoDto {
  id: string;
  fechaHoraInicio: string;
  fechaHoraFin?: string | null;
  estado: EstadoDto;
}
