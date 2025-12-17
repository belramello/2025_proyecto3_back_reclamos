import { Subarea, SubareaDocumentType } from '../schemas/subarea.schema';

export interface ISubareasRepository {
  findOne(id: string): Promise<SubareaDocumentType | null>;
  findAllSubareasDeArea(nombreArea: string): Promise<SubareaDocumentType[]>;
  findAllByAreaId(areaId: string): Promise<SubareaDocumentType[]>;
  findOneByNombre(nombre: string): Promise<SubareaDocumentType | null>;
  findAllPorArea(areaId: string): Promise<SubareaDocumentType[]>;
}
