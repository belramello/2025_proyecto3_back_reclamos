import { Inject, Injectable } from '@nestjs/common';
import { EstadosEnum } from './enums/estados-enum';
import { EstadoDocumentType } from './schemas/estado.schema';
import type { IEstadosRepository } from './repositories/estados-repository.interface';

@Injectable()
export class EstadosService {
  constructor(
    @Inject('IEstadosRepository')
    private readonly estadosRepository: IEstadosRepository,
  ) {}
  create() {
    return 'This action adds a new estado';
  }

  findAll() {
    return `This action returns all estados`;
  }

  findOne() {
    return `This action returns a # estado`;
  }

  async findOneByNombre(nombre: EstadosEnum): Promise<EstadoDocumentType> {
    return await this.estadosRepository.findOneByNombre(nombre);
  }

  update() {
    return `This action updates a # estado`;
  }

  remove() {
    return `This action removes a #estado`;
  }
}
