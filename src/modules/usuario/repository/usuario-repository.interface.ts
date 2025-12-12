import { RolDocumentType } from 'src/modules/roles/schema/rol.schema';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UsuarioDocumentType } from '../schema/usuario.schema';
import { Subarea } from 'src/modules/subareas/schemas/subarea.schema';
// 1. IMPORTAR EL DTO DE PAGINACIÓN
import { PaginationDto } from 'src/common/dto/pagination.dto';

export interface IUsuarioRepository {
  create(usuario: CreateUsuarioDto, rol: RolDocumentType): Promise<UsuarioDocumentType>;
  
  // 2. ACTUALIZAR ESTE MÉTODO
  findAll(paginationDto: PaginationDto): Promise<UsuarioDocumentType[]>;
  
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
}