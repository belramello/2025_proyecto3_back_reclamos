import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Subarea, SubareaDocumentType } from './schemas/subarea.schema';
import type { ISubareasRepository } from './repositories/subareas-repository.interface';
import { SubareasValidator } from './helpers/subareas-validator';
import { SubareaDto } from './dto/subarea-de-usuario.dto';
import { SubareasMapper } from './helpers/subareas-mapper';

@Injectable()
export class SubareasService {
  constructor(
    @Inject('ISubareasRepository')
    private readonly subareasRepository: ISubareasRepository,
    @Inject(forwardRef(() => SubareasValidator))
    private readonly subareasValidator: SubareasValidator,
    private readonly subareasMapper: SubareasMapper,
  ) {}

  async findOneByNombre(nombre: string): Promise<SubareaDocumentType | null> {
    return await this.subareasRepository.findOneByNombre(nombre);
  }

  async findAllSubareasDeUsuario(usuarioId: string): Promise<SubareaDto[]> {
    const usuario = await this.subareasValidator.validateNoCliente(usuarioId);
    let nombreArea: string;
    if (usuario.subarea == null) {
      if (usuario.area == null) {
        throw new BadRequestException(
          'El usuario no tiene subarea asignada ni area asignada',
        );
      }
      nombreArea = usuario.area.nombre;
    } else {
      nombreArea = usuario.subarea.area.nombre;
    }
    const subareas =
      await this.subareasRepository.findAllSubareasDeArea(nombreArea);
    if (usuario.subarea != null) {
      const nombreSubareaUsuario = usuario.subarea.nombre;
      const subareasFiltradas = subareas.filter(
        (subarea) => subarea.nombre !== nombreSubareaUsuario,
      );
      return this.subareasMapper.toSubareasDtos(subareasFiltradas);
    }

    return this.subareasMapper.toSubareasDtos(subareas);
  }

  async findAllSubareasDeArea(areaId: string): Promise<SubareaDocumentType[]> {
    return await this.subareasRepository.findAllSubareasDeArea(areaId);
  }

  async findOne(id: string): Promise<Subarea | null> {
    return await this.subareasRepository.findOne(id);
  }

  async findSubAreaDeArea(areaId: string): Promise<SubareaDto[]> {
    const subareas = await this.subareasRepository.findAllPorArea(areaId);
    return this.subareasMapper.toSubareasDtos(subareas);
  }
}
