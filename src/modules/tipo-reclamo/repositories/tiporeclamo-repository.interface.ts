import { TipoReclamoDocumentType } from "../schemas/tipo-reclamo.schema";

export interface ITipoReclamosRepository {
  findOneByNombre(nombre: string): Promise<TipoReclamoDocumentType>;
  findOneById(id: string): Promise<TipoReclamoDocumentType>;
}
