import { Rol } from '../schema/rol.schema';

export interface IRolesRepository {
  findAll(): Promise<Rol[]>;
  findOne(rolId: string): Promise<Rol | null>;
}
