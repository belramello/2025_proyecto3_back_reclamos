import { Proyecto, ProyectoDocument } from '../schemas/proyecto.schema';
import { CreateProyectoDto } from '../dto/create-proyecto.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto'; // Asegúrate de la ruta correcta

export interface ProyectosRepositoryInterface {
  create(createProyectoDto: CreateProyectoDto): Promise<Proyecto>;
  // Actualizamos findAll para recibir paginación
  findAll(paginationDto: PaginationDto): Promise<{ data: Proyecto[]; total: number }>;
  findOne(id: string): Promise<ProyectoDocument | null>;
  findByCliente(clienteId: string): Promise<Proyecto[]>;
  remove(id: string): Promise<void>;
}