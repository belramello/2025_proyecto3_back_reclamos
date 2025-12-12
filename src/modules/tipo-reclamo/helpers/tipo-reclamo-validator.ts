import { NotFoundException } from '@nestjs/common';
import { TipoReclamoDocumentType } from '../schemas/tipo-reclamo.schema';
import { TipoReclamosService } from '../tipo-reclamo.service';

export class TipoReclamoValidator {
  constructor(private readonly tipoReclamoService: TipoReclamosService) {}

  async validateTipoReclamoExistente(
    tipoReclamoId: string,
  ): Promise<TipoReclamoDocumentType> {
    const tipoReclamo = await this.tipoReclamoService.findOne(tipoReclamoId);
    if (!tipoReclamo) {
      throw new NotFoundException(
        `El tipo de reclamo con ID ${tipoReclamoId} no existe`,
      );
    }
    return tipoReclamo;
  }
}
