import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NivelCriticidadService } from './nivel-criticidad.service';
import { CreateNivelCriticidadDto } from './dto/create-nivel-criticidad.dto';
import { UpdateNivelCriticidadDto } from './dto/update-nivel-criticidad.dto';

@Controller('nivel-criticidad')
export class NivelCriticidadController {
  constructor(private readonly nivelCriticidadService: NivelCriticidadService) {}

  @Post()
  create(@Body() createNivelCriticidadDto: CreateNivelCriticidadDto) {
    return this.nivelCriticidadService.create(createNivelCriticidadDto);
  }

  @Get()
  findAll() {
    return this.nivelCriticidadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nivelCriticidadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNivelCriticidadDto: UpdateNivelCriticidadDto) {
    return this.nivelCriticidadService.update(+id, updateNivelCriticidadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nivelCriticidadService.remove(+id);
  }
}
