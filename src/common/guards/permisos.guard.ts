import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISO_REQUERIDO_KEY } from '../decorators/permiso-requerido.decorator';
import { RequestWithUsuario } from '../../middlewares/auth.middleware';
import { PermisosEnum } from '../../modules/permisos/enums/permisos-enum';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permisoRequerido = this.reflector.getAllAndOverride<PermisosEnum>(
      PERMISO_REQUERIDO_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permisoRequerido) return true;

    const request = context.switchToHttp().getRequest<RequestWithUsuario>();
    const usuario = request.usuario;

    if (!usuario || !usuario.rol) {
      throw new ForbiddenException('Usuario o rol no encontrado.');
    }

    const permisosDelRol = usuario.rol.permisos.map(
      (permiso) => permiso.nombre,
    );

    const tienePermiso = permisosDelRol.includes(permisoRequerido);

    if (!tienePermiso) {
      throw new ForbiddenException(
        `No tenés permiso para acceder a esta funcionalidad.`,
      );
    }

    return true;
  }
}
