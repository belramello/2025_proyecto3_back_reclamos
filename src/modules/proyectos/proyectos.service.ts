import { Inject, Injectable } from '@nestjs/common';
import type { ProyectosRepositoryInterface } from './repositories/proyectos-repository.interface';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { Proyecto, ProyectoDocument } from './schemas/proyecto.schema';

@Injectable()
export class ProyectosService {
  constructor(
    @Inject('ProyectosRepositoryInterface')
    private readonly proyectosRepository: ProyectosRepositoryInterface,
  ) {}

  async create(createProyectoDto: CreateProyectoDto) {
    return await this.proyectosRepository.create(createProyectoDto);
  }

  async findOne(id: string): Promise<ProyectoDocument | null> {
    return await this.proyectosRepository.findOne(id);
  }

  async findAll() {
    return await this.proyectosRepository.findAll();
  }

  async findAllByCliente(clienteId: string) {
    return await this.proyectosRepository.findByCliente(clienteId);
  }
}
