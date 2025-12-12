import { Inject, Injectable } from '@nestjs/common';
import type { ITipoReclamosRepository } from './repositories/tiporeclamo-repository.interface';
import { TipoReclamoDocumentType } from './schemas/tipo-reclamo.schema';

@Injectable()
export class TipoReclamosService {
  constructor(
    @Inject('ITipoReclamosRepository')
    private readonly tipoReclamosRepository: ITipoReclamosRepository,
  ) {}

  async findById(id: string): Promise<TipoReclamoDocumentType> {
    return await this.tipoReclamosRepository.findOneById(id);
  }
}
