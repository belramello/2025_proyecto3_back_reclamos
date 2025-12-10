import { Injectable } from '@nestjs/common';
import { AreaDocumentType } from '../schemas/area.schema';
import { AreaDto } from '../dto/area-dto';

@Injectable()
export class AreasMapper {
  toAreaDtos(areaDocuments: AreaDocumentType[]): AreaDto[] {
    return areaDocuments.map((areaDocument) => {
      return this.toAreaDto(areaDocument);
    });
  }

  toAreaDto(areaDocument: AreaDocumentType): AreaDto {
    return {
      id: String(areaDocument._id),
      nombre: areaDocument.nombre,
    };
  }

  toAreaDtoOrNull(area: AreaDocumentType | undefined): AreaDto | null {
    if (!area) return null;
    return this.toAreaDto(area);
  }
}
