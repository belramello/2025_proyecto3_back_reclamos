import { Injectable } from '@nestjs/common';
import { CreateSubareaDto } from './dto/create-subarea.dto';
import { UpdateSubareaDto } from './dto/update-subarea.dto';

@Injectable()
export class SubareasService {
  create(createSubareaDto: CreateSubareaDto) {
    return 'This action adds a new subarea';
  }

  findAll() {
    return `This action returns all subareas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subarea`;
  }

  update(id: number, updateSubareaDto: UpdateSubareaDto) {
    return `This action updates a #${id} subarea`;
  }

  remove(id: number) {
    return `This action removes a #${id} subarea`;
  }
}
