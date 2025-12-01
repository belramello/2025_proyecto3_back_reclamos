import { AreaDocumentType } from '../schemas/area.schema';

export interface IAreaRepository {
  findOne(id: string): Promise<AreaDocumentType | null>;
}
