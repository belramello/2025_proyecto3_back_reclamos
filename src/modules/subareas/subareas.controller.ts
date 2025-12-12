import { Controller, Get, UseGuards, Req, Param } from '@nestjs/common';
import { SubareasService } from './subareas.service';
import type { RequestWithUsuario } from 'src/middlewares/auth.middleware';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import { SubareaDto } from './dto/subarea-de-usuario.dto';

@Controller('subareas')
export class SubareasController {
  constructor(private readonly subareasService: SubareasService) {}

  @UseGuards(AuthGuard)
  @Get('subareas-de-usuario')
  async findAllSubareasDeEmpleado(
    @Req() req: RequestWithUsuario,
  ): Promise<SubareaDto[]> {
    return this.subareasService.findAllSubareasDeUsuario(
      String(req.usuario._id),
    );
  }

  @Get('area/:id')
  async findSubAreaDeArea(@Param('id') id: string): Promise<SubareaDto[]> {
    return this.subareasService.findSubAreaDeArea(id);
  }
}
