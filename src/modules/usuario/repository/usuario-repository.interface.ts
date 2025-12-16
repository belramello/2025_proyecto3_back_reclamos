import { RolDocumentType } from 'src/modules/roles/schema/rol.schema';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UsuarioDocumentType } from '../schema/usuario.schema';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export interface IUsuarioRepository {
  create(
    usuario: CreateUsuarioDto,
    rol: RolDocumentType,
  ): Promise<UsuarioDocumentType>;
  findAll(
    paginationDto: PaginationDto,
  ): Promise<{ data: UsuarioDocumentType[]; total: number }>;
  findAllEmpleadosBySubareaId(
    subareaIds: string,
  ): Promise<UsuarioDocumentType[]>;
  findAllEmpleadosDeSubarea(
    nombreSubarea: string,
  ): Promise<UsuarioDocumentType[]>;
  findOne(id: string): Promise<UsuarioDocumentType | null>;
  findAllEmpleadosDeArea(nombreArea: string): Promise<UsuarioDocumentType[]>;
  update(
    id: string,
    updateData: Partial<UsuarioDocumentType>,
  ): Promise<UsuarioDocumentType>;
  remove(id: string): Promise<void>;
  findByEmail(email: string): Promise<UsuarioDocumentType | null>;
  findByToken(token: string): Promise<UsuarioDocumentType | null>;
  countByAreaAndRole(areaId: string, role: string): Promise<number>;
  findByIdSimple(id: string): Promise<UsuarioDocumentType | null>;
  guardarTokenReset(
    email: string,
    token: string,
    expiration: Date,
  ): Promise<void>;
  findOneByResetToken(token: string): Promise<UsuarioDocumentType | null>;
  updatePassword(id: string, newPassword: string): Promise<void>;
}
