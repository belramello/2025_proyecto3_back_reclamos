import { Inject, Injectable } from '@nestjs/common';
import { CreateSubareaDto } from './dto/create-subarea.dto';
import { UpdateSubareaDto } from './dto/update-subarea.dto';
import { Subarea } from './schemas/subarea.schema';
import type { ISubareasRepository } from './repositories/subareas-repository.interface';

@Injectable()
export class SubareasService {
  constructor(
    @Inject('ISubareasRepository')
    private readonly subareasRepository: ISubareasRepository,
  ) {}
  create(createSubareaDto: CreateSubareaDto) {
    return 'This action adds a new subarea';
  }

  findAll() {
    return `This action returns all subareas`;
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
