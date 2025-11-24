import { Controller, Get, Param, Delete } from '@nestjs/common';
import { HistorialAsignacionService } from './historial-asignacion.service';

@Controller('historial-asignacion')
export class HistorialAsignacionController {
  constructor(
    private readonly historialAsignacionService: HistorialAsignacionService,
  ) {}
  /*
  @Post()
  create(@Body() createHistorialAsignacionDto: CreateHistorialAsignacionDto) {
    return this.historialAsignacionService.create(createHistorialAsignacionDto);
  }
    */

  @Get()
  findAll() {
    return this.historialAsignacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historialAsignacionService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historialAsignacionService.remove(+id);
  }
}
