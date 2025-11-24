import { EstadoDocumentType } from '../schemas/estado.schema';

export interface IEstadosRepository {
  findOneByNombre(nombre: string): Promise<EstadoDocumentType>;
}
