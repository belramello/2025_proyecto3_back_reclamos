import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PermisosService } from '../../../modules/permisos/permisos.service';
import { RolesService } from '../roles.service';
import { Rol } from '../schema/rol.schema';
import { Permiso } from 'src/modules/permisos/schemas/permiso.schema';

@Injectable()
export class RolesValidator {
  constructor(
    @Inject(forwardRef(() => PermisosService))
    private readonly permisosService: PermisosService,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
  ) {}

  async validatePermisosExistentes(permisosId: string[]): Promise<Permiso[]> {
    const permisos: Permiso[] = [];
    for (const permisoId of permisosId) {
      const permiso = await this.permisosService.findOne(permisoId);
      if (!permiso) {
        throw new NotFoundException(
          `Permiso con ID ${permisoId} no encontrado`,
        );
      }
      permisos.push(permiso);
    }
    return permisos;
  }

  async validateRolExistente(rolId: string): Promise<Rol> {
    const rol = await this.rolesService.findOne(rolId);
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${rolId} no encontrado`);
    }
    return rol;
  }
}
