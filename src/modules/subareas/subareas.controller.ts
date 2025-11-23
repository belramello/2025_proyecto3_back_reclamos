import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubareasService } from './subareas.service';
import { CreateSubareaDto } from './dto/create-subarea.dto';
import { UpdateSubareaDto } from './dto/update-subarea.dto';

@Controller('subareas')
export class SubareasController {
  constructor(private readonly subareasService: SubareasService) {}

  @Post()
  create(@Body() createSubareaDto: CreateSubareaDto) {
    return this.subareasService.create(createSubareaDto);
  }

  @Get()
  findAll() {
    return this.subareasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subareasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubareaDto: UpdateSubareaDto) {
    return this.subareasService.update(+id, updateSubareaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subareasService.remove(+id);
  }
}
