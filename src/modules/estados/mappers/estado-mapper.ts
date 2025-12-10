import { Injectable } from '@nestjs/common';
import { EstadoDto } from '../dto/estado.dto';
import { EstadoDocumentType } from '../schemas/estado.schema';

@Injectable()
export class EstadosMapper {
  toEstadoDto(estado: EstadoDocumentType): EstadoDto {
    return {
      id: String(estado._id),
      nombre: estado.nombre,
    };
  }

  toEstadoDtoOrNull(estado: EstadoDocumentType | undefined): EstadoDto | null {
    if (!estado) return null;
    return this.toEstadoDto(estado);
  }
}
