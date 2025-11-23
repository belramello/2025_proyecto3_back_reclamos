import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistorialAsignacionService } from './historial-asignacion.service';
import { CreateHistorialAsignacionDto } from './dto/create-historial-asignacion.dto';
import { UpdateHistorialAsignacionDto } from './dto/update-historial-asignacion.dto';

@Controller('historial-asignacion')
export class HistorialAsignacionController {
  constructor(private readonly historialAsignacionService: HistorialAsignacionService) {}

  @Post()
  create(@Body() createHistorialAsignacionDto: CreateHistorialAsignacionDto) {
    return this.historialAsignacionService.create(createHistorialAsignacionDto);
  }

  @Get()
  findAll() {
    return this.historialAsignacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historialAsignacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistorialAsignacionDto: UpdateHistorialAsignacionDto) {
    return this.historialAsignacionService.update(+id, updateHistorialAsignacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historialAsignacionService.remove(+id);
  }
}
