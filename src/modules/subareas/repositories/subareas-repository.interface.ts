import { Subarea } from '../schemas/subarea.schema';

export interface ISubareasRepository {
  findOne(id: string): Promise<Subarea | null>;
}
