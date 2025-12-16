import { Controller, Get, UseGuards, Req, Param } from '@nestjs/common';
import { SubareasService } from './subareas.service';
import type { RequestWithUsuario } from 'src/middlewares/auth.middleware';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import { SubareaDto } from './dto/subarea-de-usuario.dto';
import { PermisosGuard } from 'src/common/guards/permisos.guard';
import { PermisoRequerido } from 'src/common/decorators/permiso-requerido.decorator';
import { PermisosEnum } from '../permisos/enums/permisos-enum';

@UseGuards(AuthGuard, PermisosGuard)
@Controller('subareas')
export class SubareasController {
  constructor(private readonly subareasService: SubareasService) {}

  @Get('subareas-de-usuario')
  @PermisoRequerido(PermisosEnum.MOVER_RECLAMO)
  async findAllSubareasDeEmpleado(
    @Req() req: RequestWithUsuario,
  ): Promise<SubareaDto[]> {
    return this.subareasService.findAllSubareasDeUsuario(
      String(req.usuario._id),
    );
  }

  @Get('area/:id')
  @PermisoRequerido(PermisosEnum.ASIGNAR_RECLAMOS)
  async findSubareaDeArea(@Param('id') id: string): Promise<SubareaDto[]> {
    return this.subareasService.findSubAreaDeArea(id);
  }
}
