import { Controller } from '@nestjs/common';
import { HistorialEstadoService } from './historial-estado.service';

@Controller('historial-estado')
export class HistorialEstadoController {
  constructor(
    private readonly historialEstadoService: HistorialEstadoService,
  ) {}
}
