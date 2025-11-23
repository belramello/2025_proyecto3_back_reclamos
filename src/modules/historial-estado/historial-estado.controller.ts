import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistorialEstadoService } from './historial-estado.service';
import { CreateHistorialEstadoDto } from './dto/create-historial-estado.dto';
import { UpdateHistorialEstadoDto } from './dto/update-historial-estado.dto';

@Controller('historial-estado')
export class HistorialEstadoController {
  constructor(private readonly historialEstadoService: HistorialEstadoService) {}

  @Post()
  create(@Body() createHistorialEstadoDto: CreateHistorialEstadoDto) {
    return this.historialEstadoService.create(createHistorialEstadoDto);
  }

  @Get()
  findAll() {
    return this.historialEstadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historialEstadoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistorialEstadoDto: UpdateHistorialEstadoDto) {
    return this.historialEstadoService.update(+id, updateHistorialEstadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historialEstadoService.remove(+id);
  }
}
