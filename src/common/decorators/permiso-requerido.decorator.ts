import { SetMetadata } from '@nestjs/common';
import { PermisosEnum } from '../../modules/permisos/enums/permisos-enum';

export const PERMISO_REQUERIDO_KEY = 'permiso_requerido';

export const PermisoRequerido = (permiso: PermisosEnum) =>
  SetMetadata(PERMISO_REQUERIDO_KEY, permiso);
