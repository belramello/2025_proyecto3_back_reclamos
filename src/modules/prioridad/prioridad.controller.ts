import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrioridadService } from './prioridad.service';
import { CreatePrioridadDto } from './dto/create-prioridad.dto';
import { UpdatePrioridadDto } from './dto/update-prioridad.dto';

@Controller('prioridad')
export class PrioridadController {
  constructor(private readonly prioridadService: PrioridadService) {}

  @Post()
  create(@Body() createPrioridadDto: CreatePrioridadDto) {
    return this.prioridadService.create(createPrioridadDto);
  }

  @Get()
  findAll() {
    return this.prioridadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prioridadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrioridadDto: UpdatePrioridadDto) {
    return this.prioridadService.update(+id, updatePrioridadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prioridadService.remove(+id);
  }
}
