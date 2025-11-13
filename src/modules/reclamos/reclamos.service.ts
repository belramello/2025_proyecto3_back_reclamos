import { Injectable } from '@nestjs/common';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto';

@Injectable()
export class ReclamosService {
  create(createReclamoDto: CreateReclamoDto) {
    return 'This action adds a new reclamo';
  }

  findAll() {
    return `This action returns all reclamos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reclamo`;
  }

  update(id: number, updateReclamoDto: UpdateReclamoDto) {
    return `This action updates a #${id} reclamo`;
  }

  remove(id: number) {
    return `This action removes a #${id} reclamo`;
  }
}
