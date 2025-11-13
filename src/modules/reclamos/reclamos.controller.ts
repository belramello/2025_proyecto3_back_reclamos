import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReclamosService } from './reclamos.service';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto';

@Controller('reclamos')
export class ReclamosController {
  constructor(private readonly reclamosService: ReclamosService) {}

  @Post()
  create(@Body() createReclamoDto: CreateReclamoDto) {
    return this.reclamosService.create(createReclamoDto);
  }

  @Get()
  findAll() {
    return this.reclamosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reclamosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReclamoDto: UpdateReclamoDto) {
    return this.reclamosService.update(+id, updateReclamoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reclamosService.remove(+id);
  }
}
