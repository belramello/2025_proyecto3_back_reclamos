import { Inject, Injectable, forwardRef } from '@nestjs/common';
import type { ProyectosRepositoryInterface } from './repositories/proyectos-repository.interface';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UsuariosValidator } from '../usuario/helpers/usuarios-validator';
import { UsuarioDocumentType } from '../usuario/schema/usuario.schema';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
    actor?: UsuarioDocumentType
  ) {
    if (actor) {
      await this.usuariosValidator.validateAdminExistente(String(actor._id));
    }
    
    await this.usuariosValidator.validateClienteExistente(createProyectoDto.cliente);

    return await this.proyectosRepository.create(createProyectoDto);
  }

  // --- MODIFICADO PARA PAGINACIÓN ---
  async findAll(paginationDto: PaginationDto) {
    return await this.proyectosRepository.findAll(paginationDto);
  }

  async findAllByCliente(clienteId: string) {
    return await this.proyectosRepository.findByCliente(clienteId);
  }
}