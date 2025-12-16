import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import type { ProyectosRepositoryInterface } from './repositories/proyectos-repository.interface';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UsuariosValidator } from '../usuario/helpers/usuarios-validator';
import { UsuarioDocumentType } from '../usuario/schema/usuario.schema';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Proyecto, ProyectoDocument } from './schemas/proyecto.schema';

@Injectable()
export class ProyectosService {
  constructor(
    @Inject('ProyectosRepositoryInterface')
    private readonly proyectosRepository: ProyectosRepositoryInterface,
    @Inject(forwardRef(() => UsuariosValidator))
    private readonly usuariosValidator: UsuariosValidator,
  ) {}

  async create(
    createProyectoDto: CreateProyectoDto,
    actor?: UsuarioDocumentType,
  ) {
    if (actor) {
      await this.usuariosValidator.validateAdminExistente(String(actor._id));
    }
    await this.usuariosValidator.validateClienteExistente(
      createProyectoDto.cliente,
    );
    return await this.proyectosRepository.create(createProyectoDto);
  }

  async findAll(paginationDto: PaginationDto) {
    if (!paginationDto.busqueda || paginationDto.busqueda.trim() === '') {
      delete paginationDto.busqueda;

      const { data, total } =
        await this.proyectosRepository.findAll(paginationDto);

      const limit = paginationDto.limit || 5;
      const totalPages = Math.ceil(total / limit);

      return {
        data,
        total,
        page: paginationDto.page || 1,
        limit,
        totalPages,
      };
    }
  }

  async findOne(id: string): Promise<ProyectoDocument | null> {
    return await this.proyectosRepository.findOne(id);
  }

  async findAllByCliente(clienteId: string): Promise<Proyecto[]> {
    return await this.proyectosRepository.findByCliente(clienteId);
  }
  async remove(id: string): Promise<void> {
    await this.proyectosRepository.remove(id);
  }
}
