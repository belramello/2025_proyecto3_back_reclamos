import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SubareasService } from './subareas.service';
import { CreateSubareaDto } from './dto/create-subarea.dto';
import { UpdateSubareaDto } from './dto/update-subarea.dto';
import type { RequestWithUsuario } from 'src/middlewares/auth.middleware';
import { AuthGuard } from 'src/middlewares/auth.middleware';

@Controller('subareas')
export class SubareasController {
  constructor(private readonly subareasService: SubareasService) {}

  @Post()
  create(@Body() createSubareaDto: CreateSubareaDto) {
    return this.subareasService.create(createSubareaDto);
  }

  @UseGuards(AuthGuard)
  @Get('subareas-de-usuario')
  async findAllSubareasDeEmpleado(@Req() req: RequestWithUsuario) {
    return this.subareasService.findAllSubareasDeUsuario(
      String(req.usuario._id),
    );
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
