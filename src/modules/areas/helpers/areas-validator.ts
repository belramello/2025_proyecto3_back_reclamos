import { Injectable, NotFoundException } from '@nestjs/common';
import { AreasService } from '../areas.service';
import { Area } from '../schemas/area.schema';

@Injectable()
export class AreasValidator {
  constructor(private readonly areasService: AreasService) {}

  async validateAreaExistente(areaId: string): Promise<Area> {
    const area = await this.areasService.findOne(areaId);
    if (!area) {
      throw new NotFoundException(`La área con ID ${areaId} no existe`);
    }
    return area;
  }
}
