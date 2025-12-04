import { Permiso } from '../schemas/permiso.schema';

export interface IPermisosRepository {
  findAll(): Promise<Permiso[]>;
  findAllByRol(id: string): Promise<Permiso[]>;
  findOne(rolId: string): Promise<Permiso | null>;
}
