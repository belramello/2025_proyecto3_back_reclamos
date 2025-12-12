import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { SubareasService } from './subareas.service';
import type { RequestWithUsuario } from 'src/middlewares/auth.middleware';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import { SubareaDto } from './dto/subarea-de-usuario.dto';
import type { AreaDocumentType } from '../areas/schemas/area.schema';

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

  @Get('area')
  async findSubAreaDeArea(@Req() req: AreaDocumentType): Promise<SubareaDto[]> {
    const area = req._id;
    if (area) {
      return this.subareasService.findSubAreaDeArea(String(area));
    } else {
      throw new Error('req.usuario.area is undefined');
    }
  }
}
