import { Controller, UseGuards, Get } from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { Permiso } from './schemas/permiso.schema';

@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @Get()
  findAll(): Promise<Permiso[]> {
    return this.permisosService.findAll();
  }
}
