import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoReclamoService } from './tipo-reclamo.service';
import { CreateTipoReclamoDto } from './dto/create-tipo-reclamo.dto';
import { UpdateTipoReclamoDto } from './dto/update-tipo-reclamo.dto';

@Controller('tipo-reclamo')
export class TipoReclamoController {
  constructor(private readonly tipoReclamoService: TipoReclamoService) {}

  @Post()
  create(@Body() createTipoReclamoDto: CreateTipoReclamoDto) {
    return this.tipoReclamoService.create(createTipoReclamoDto);
  }

  @Get()
  findAll() {
    return this.tipoReclamoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoReclamoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoReclamoDto: UpdateTipoReclamoDto) {
    return this.tipoReclamoService.update(+id, updateTipoReclamoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoReclamoService.remove(+id);
  }
}
