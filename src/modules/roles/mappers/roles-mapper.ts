import { Injectable } from '@nestjs/common';
import { RespuestaFindOneRolesDto } from '../dto/respuesta-find-one-roles.dto';
import { Rol } from '../schema/rol.schema';

@Injectable()
export class RolesMapper {
  toRespuestaFindOneRoles(roles: Rol[]): RespuestaFindOneRolesDto[] {
    return roles.map((rol) => this.toRespuestaFindOne(rol));
  }

  toRespuestaFindOne(rol: Rol): RespuestaFindOneRolesDto {
    return {
      id: (rol as any)._id?.toString(),
      nombre: rol.nombre,
      permisos: rol.permisos,
    };
  }
}
