import { Permiso } from 'src/modules/permisos/schemas/permiso.schema';
import { Rol } from 'src/modules/roles/schema/rol.schema';

export interface IUsuarioAuth {
  id: string;
  email: string;
  contraseña: string;
  nombre?: string;
  rol: Rol;
  permisos: Permiso[];
}
