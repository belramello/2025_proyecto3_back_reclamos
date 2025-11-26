import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubareasService } from '../subareas.service';
import { Subarea } from '../schemas/subarea.schema';

@Injectable()
export class SubareasValidator {
  constructor(private readonly subareasService: SubareasService) {}

  async validateSubareaExistente(id: string): Promise<Subarea> {
    const subarea = await this.subareasService.findOne(id);
    if (!subarea) {
      throw new NotFoundException(`El subarea con ID ${id} no existe`);
    }
    return subarea;
  }
}
