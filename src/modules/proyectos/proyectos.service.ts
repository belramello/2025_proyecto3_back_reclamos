import { Inject, Injectable } from '@nestjs/common';
import type { ProyectosRepositoryInterface } from './repositories/proyectos-repository.interface';
import { CreateProyectoDto } from './dto/create-proyecto.dto';

@Injectable()
export class ProyectosService {
  constructor(
    @Inject('ProyectosRepositoryInterface')
    private readonly proyectosRepository: ProyectosRepositoryInterface,
  ) {}

  async create(createProyectoDto: CreateProyectoDto) {
    return await this.proyectosRepository.create(createProyectoDto);
  }

  async findAll() {
    return await this.proyectosRepository.findAll();
  }

  async findAllByCliente(clienteId: string) {
    return await this.proyectosRepository.findByCliente(clienteId);
  }
}
