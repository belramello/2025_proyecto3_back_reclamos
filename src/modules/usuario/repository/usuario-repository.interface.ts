import { Rol } from 'src/modules/roles/schema/rol.schema';
import { IUsuarioAuth } from '../../auth/interface/usuario-auth.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { Usuario } from '../schema/usuario.schema';

export interface IUsuarioRepository {
  create(usuario: CreateUsuarioDto, rol: Rol): Promise<Usuario>;
  findAll(): Promise<Usuario[]>;
  findOne(id: string): Promise<Usuario | null>;
  update(id: string, updateData: Partial<Usuario>): Promise<Usuario>;
  remove(id: string): Promise<void>;
  findByEmail(email: string): Promise<Usuario | null>;
  findByEmailForAuth(email: string): Promise<IUsuarioAuth | null>;
}
