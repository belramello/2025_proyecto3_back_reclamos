import { Rol, RolDocumentType } from '../schema/rol.schema';

export interface IRolesRepository {
  findAll(): Promise<RolDocumentType[]>;
  findOne(rolId: string): Promise<RolDocumentType | null>;
  findByName(nombre: string): Promise<RolDocumentType | null>;
}
