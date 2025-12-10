import { Controller } from '@nestjs/common';
import { HistorialAsignacionService } from './historial-asignacion.service';

@Controller('historial-asignacion')
export class HistorialAsignacionController {
  constructor(
    private readonly historialAsignacionService: HistorialAsignacionService,
  ) {}
}
