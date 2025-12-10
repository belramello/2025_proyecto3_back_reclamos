import { Injectable } from '@nestjs/common';
import { SubareaDto } from '../dto/subarea-de-usuario.dto';
import { SubareaDocumentType } from '../schemas/subarea.schema';

@Injectable()
export class SubareasMapper {
  toSubareaDto(subarea: SubareaDocumentType): SubareaDto {
    return {
      id: String(subarea._id),
      nombre: subarea.nombre,
    };
  }

  toSubareaDtoOrNull(
    subarea: SubareaDocumentType | undefined,
  ): SubareaDto | null {
    if (!subarea) return null;
    return this.toSubareaDto(subarea);
  }

  toSubareasDtos(subareas: SubareaDocumentType[]): SubareaDto[] {
    return subareas.map((subarea) => {
      return this.toSubareaDto(subarea);
    });
  }
}
