import { Proyecto, ProyectoDocument } from '../schemas/proyecto.schema';
import { CreateProyectoDto } from '../dto/create-proyecto.dto';

export interface ProyectosRepositoryInterface {
  create(createProyectoDto: CreateProyectoDto): Promise<Proyecto>;
  findOne(id: string): Promise<ProyectoDocument | null>;
  findAll(): Promise<Proyecto[]>;
  findByCliente(clienteId: string): Promise<Proyecto[]>;
}
