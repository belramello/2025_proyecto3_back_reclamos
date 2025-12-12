import { Proyecto } from '../schemas/proyecto.schema';
import { CreateProyectoDto } from '../dto/create-proyecto.dto';

export interface ProyectosRepositoryInterface {
  create(createProyectoDto: CreateProyectoDto): Promise<Proyecto>;
  findAll(): Promise<Proyecto[]>;
  findByCliente(clienteId: string): Promise<Proyecto[]>;
}
