import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PermisosService } from '../../../modules/permisos/permisos.service';
import { RolesService } from '../roles.service';
import { RolDocumentType } from '../schema/rol.schema'; // Importamos el tipo Documento
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

  // Corregido: Devuelve RolDocumentType
  async validateRolExistente(nombreRol: string): Promise<RolDocumentType> {
    const rol = await this.rolesService.findByName(nombreRol);
    
    if (!rol) {
      throw new NotFoundException(
        `El rol "${nombreRol}" no existe. (Asegúrate de enviarlo en mayúsculas, ej: CLIENTE)`
      );
    }
    return rol;
  }
}