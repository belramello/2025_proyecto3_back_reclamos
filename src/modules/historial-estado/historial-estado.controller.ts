import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HistorialEstadoService } from './historial-estado.service';

@Controller('historial-estado')
export class HistorialEstadoController {
  constructor(
    private readonly historialEstadoService: HistorialEstadoService,
  ) {}

  @Get()
  findAll() {
    return this.historialEstadoService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historialEstadoService.remove(+id);
  }
}
