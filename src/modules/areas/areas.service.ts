import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Area, AreaDocumentType } from './schemas/area.schema';
import type { IAreaRepository } from './repositories/areas-repository.interface';
import { AreasMapper } from './helpers/areas-mapper';
import { AreaDto } from './dto/area-dto';
import { AreasValidator } from './helpers/areas-validator';

@Injectable()
export class AreasService {
  constructor(
    @Inject('IAreaRepository')
    private readonly areasRepository: IAreaRepository,
    private readonly areasMapper: AreasMapper,
    @Inject(forwardRef(() => AreasValidator))
    private readonly areasValidator: AreasValidator,
  ) {}

  async findAll(): Promise<AreaDto[]> {
    const areas = await this.areasRepository.findAll();
    return this.areasMapper.toAreaDtos(areas);
  }

  async findAllByUsuario(usuarioId: string): Promise<AreaDto[]> {
    const usuario = await this.areasValidator.validateNoCliente(usuarioId);
    const areas = await this.areasRepository.findAll();
    let areaDesconsiderada: string;
    if (usuario.subarea) {
      areaDesconsiderada = usuario.subarea.area.nombre;
    } else {
      if (usuario.area) {
        areaDesconsiderada = usuario.area.nombre;
      }
    }
    const areasFiltradas = areas.filter(
      (area) => area.nombre !== areaDesconsiderada,
    );
    return this.areasMapper.toAreaDtos(areasFiltradas);
  }

  async findOne(id: string): Promise<Area | null> {
    return await this.areasRepository.findOne(id);
  }

  async findOneByNombre(nombre: string): Promise<AreaDocumentType | null> {
    return await this.areasRepository.findOneByNombre(nombre);
  }
}
