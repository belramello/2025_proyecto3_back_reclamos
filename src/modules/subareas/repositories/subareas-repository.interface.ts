import { Subarea, SubareaDocumentType } from '../schemas/subarea.schema';

export interface ISubareasRepository {
  findOne(id: string): Promise<Subarea | null>;
  findAllSubareasDeArea(nombreArea: string): Promise<SubareaDocumentType[]>;
}
