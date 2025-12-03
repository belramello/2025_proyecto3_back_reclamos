import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateSubareaDto } from './dto/create-subarea.dto';
import { UpdateSubareaDto } from './dto/update-subarea.dto';
import { Subarea, SubareaDocumentType } from './schemas/subarea.schema';
import type { ISubareasRepository } from './repositories/subareas-repository.interface';
import { SubareasValidator } from './helpers/subareas-validator';
import { SubareaDeUsuarioDto } from './dto/subarea-de-usuario.dto';
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
  create(createSubareaDto: CreateSubareaDto) {
    return 'This action adds a new subarea';
  }

  findAll() {
    return `This action returns all subareas`;
  }

  async findOneByNombre(nombre: string): Promise<SubareaDocumentType | null> {
    return await this.subareasRepository.findOneByNombre(nombre);
  }

  async findAllSubareasDeUsuario(
    usuarioId: string,
  ): Promise<SubareaDeUsuarioDto[]> {
    const usuario = await this.subareasValidator.validateNoCliente(usuarioId);
    let nombreArea: string;
    if (usuario.subarea == null) {
      if (usuario.area == null) {
        throw new BadRequestException(
          'El usuario no tiene subarea asignada ni area asignada',
        );
      } else {
        nombreArea = usuario.area.nombre;
      }
    } else {
      nombreArea = usuario.subarea.area.nombre;
    }
    const subareas =
      await this.subareasRepository.findAllSubareasDeArea(nombreArea);
    return this.subareasMapper.toSubareasDeUsuarioDtos(subareas);
  }

  async findOne(id: string): Promise<Subarea | null> {
    return await this.subareasRepository.findOne(id);
  }

  update(id: number, updateSubareaDto: UpdateSubareaDto) {
    return `This action updates a #${id} subarea`;
  }

  remove(id: number) {
    return `This action removes a #${id} subarea`;
  }
}
