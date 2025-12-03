import { Rol } from 'src/modules/roles/schema/rol.schema';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UsuarioDocumentType } from '../schema/usuario.schema';
import { Subarea } from 'src/modules/subareas/schemas/subarea.schema';

export interface IUsuarioRepository {
  create(usuario: CreateUsuarioDto, rol: Rol): Promise<UsuarioDocumentType>;
  findAll(): Promise<UsuarioDocumentType[]>;
  findAllEmpleadosBySubareaId(
    subareaIds: string,
  ): Promise<UsuarioDocumentType[]>;
  findAllEmpleadosDeSubarea(
    nombreSubarea: string,
  ): Promise<UsuarioDocumentType[]>;
  findOne(id: string): Promise<UsuarioDocumentType | null>;
  update(
    id: string,
    updateData: Partial<UsuarioDocumentType>,
  ): Promise<UsuarioDocumentType>;
  remove(id: string): Promise<void>;
  findByEmail(email: string): Promise<UsuarioDocumentType | null>;
}
