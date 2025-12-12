import { Injectable, NotFoundException } from '@nestjs/common';
import { ProyectosService } from '../proyectos.service';
import { ProyectoDocument } from '../schemas/proyecto.schema';

@Injectable()
export class ProyectosValidator {
  constructor(private readonly proyectosService: ProyectosService) {}

  async validateProyectoExistente(id: string): Promise<ProyectoDocument> {
    const proyecto = await this.proyectosService.findOne(id);
    if (!proyecto) {
      throw new NotFoundException(`El proyecto con ID ${id} no existe`);
    }
    return proyecto;
  }
}
