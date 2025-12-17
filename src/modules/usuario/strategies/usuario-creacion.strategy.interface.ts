import { RolesEnum } from 'src/modules/roles/enums/roles-enum';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { RolDocumentType } from 'src/modules/roles/schema/rol.schema';
import { CreacionUsuarioDto } from '../dto/creacion-usuario.dto';
import { UsuarioDocumentType } from '../schema/usuario.schema';
import { SubareaDocumentType } from 'src/modules/subareas/schemas/subarea.schema';
import { AreaDocumentType } from 'src/modules/areas/schemas/area.schema';

export interface UsuarioCreacionStrategy {
  tipo: RolesEnum;

  validate(
    actor: UsuarioDocumentType,
    dto: CreateUsuarioDto,
  ): Promise<AreaDocumentType | SubareaDocumentType | void>;
  prepareData(
    dto: CreateUsuarioDto,
    rol: RolDocumentType,
    contexto?: unknown,
  ): Promise<CreacionUsuarioDto>;
  crear(
    actor: UsuarioDocumentType,
    dto: CreateUsuarioDto,
    rol: RolDocumentType,
  ): Promise<CreacionUsuarioDto>;
}
