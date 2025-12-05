import { Injectable } from '@nestjs/common';
import { SubareaDeUsuarioDto } from '../dto/subarea-de-usuario.dto';
import { SubareaDocumentType } from '../schemas/subarea.schema';

@Injectable()
export class SubareasMapper {
  toSubareaDeUsuarioDto(subarea: SubareaDocumentType): SubareaDeUsuarioDto {
    return {
      id: String(subarea._id),
      nombre: subarea.nombre,
    };
  }

  toSubareasDeUsuarioDtos(
    subareas: SubareaDocumentType[],
  ): SubareaDeUsuarioDto[] {
    return subareas.map((subarea) => {
      return this.toSubareaDeUsuarioDto(subarea);
    });
  }
}
