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

  async findOneByNombre(nombre: EstadosEnum): Promise<EstadoDocumentType> {
    return await this.estadosRepository.findOneByNombre(nombre);
  }
}
