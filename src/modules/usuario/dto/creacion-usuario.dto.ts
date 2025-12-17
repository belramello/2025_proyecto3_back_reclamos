import { AreaDocumentType } from 'src/modules/areas/schemas/area.schema';
import { RolDocumentType } from 'src/modules/roles/schema/rol.schema';
import { SubareaDocumentType } from 'src/modules/subareas/schemas/subarea.schema';

export class CreacionUsuarioDto {
  nombreUsuario: string;
  email: string;
  contraseña: string;
  rol: RolDocumentType;
  nombre?: string;
  direccion?: string;
  telefono?: string;
  subarea?: SubareaDocumentType;
  area?: AreaDocumentType;
  tokenActivacion?: string;
  tokenExpiracion?: Date;
}
