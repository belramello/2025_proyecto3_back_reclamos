import { Inject, Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area, AreaDocumentType } from './schemas/area.schema';
import type { IAreaRepository } from './repositories/areas-repository.interface';
import { AreasMapper } from './helpers/areas-mapper';
import { AreaDto } from './dto/area-dto';

@Injectable()
export class AreasService {
  constructor(
    @Inject('IAreaRepository')
    private readonly areasRepository: IAreaRepository,
    private readonly areasMapper: AreasMapper,
  ) {}

  async findAll(): Promise<AreaDto[]> {
    const areas = await this.areasRepository.findAll();
    return this.areasMapper.toAreaDtos(areas);
  }

  async findOne(id: string): Promise<Area | null> {
    return await this.areasRepository.findOne(id);
  }

  async findOneByNombre(nombre: string): Promise<AreaDocumentType | null> {
    return await this.areasRepository.findOneByNombre(nombre);
  }
}
