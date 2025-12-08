import { RolDocumentType } from 'src/modules/roles/schema/rol.schema';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UsuarioDocumentType } from '../schema/usuario.schema';

export interface IUsuarioRepository {
  create(usuario: CreateUsuarioDto, rol: RolDocumentType): Promise<UsuarioDocumentType>;
  findAll(): Promise<UsuarioDocumentType[]>;
  findOne(id: string): Promise<UsuarioDocumentType | null>;
  update(
    id: string,
    updateData: Partial<UsuarioDocumentType>,
  ): Promise<UsuarioDocumentType>;
  remove(id: string): Promise<void>;
  findByEmail(email: string): Promise<UsuarioDocumentType | null>;
  
  findByToken(token: string): Promise<UsuarioDocumentType | null>;
}