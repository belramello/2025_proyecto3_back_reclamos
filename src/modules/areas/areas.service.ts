import { Inject, Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './schemas/area.schema';
import type { IAreaRepository } from './repositories/areas-repository.interface';

@Injectable()
export class AreasService {
  constructor(
    @Inject('IAreaRepository')
    private readonly areasRepository: IAreaRepository,
  ) {}
  create(createAreaDto: CreateAreaDto) {
    return 'This action adds a new area';
  }

  findAll() {
    return `This action returns all areas`;
  }

  async findOne(id: string): Promise<Area | null> {
    return await this.areasRepository.findOne(id);
  }

  update(id: number, updateAreaDto: UpdateAreaDto) {
    return `This action updates a #${id} area`;
  }

  remove(id: number) {
    return `This action removes a #${id} area`;
  }
}
