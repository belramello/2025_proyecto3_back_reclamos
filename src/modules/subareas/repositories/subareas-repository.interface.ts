import { Subarea, SubareaDocumentType } from '../schemas/subarea.schema';

export interface ISubareasRepository {
  findOne(id: string): Promise<Subarea | null>;
  findAllSubareasDeArea(nombreArea: string): Promise<SubareaDocumentType[]>;
  findAllByAreaId(areaId: string): Promise<SubareaDocumentType[]>;
  findOneByNombre(nombre: string): Promise<SubareaDocumentType | null>;
  findSubAreaDeArea(areaId: string): Promise<SubareaDocumentType[]>;
}
