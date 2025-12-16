import { TipoReclamoDocumentType } from '../schemas/tipo-reclamo.schema';

export interface ITipoReclamosRepository {
  findOneByNombre(nombre: string): Promise<TipoReclamoDocumentType>;
  findOne(id: string): Promise<TipoReclamoDocumentType | null>;
  findAll(): Promise<TipoReclamoDocumentType[]>;
}
