import { Injectable } from '@nestjs/common';
import { CreatePrioridadDto } from './dto/create-prioridad.dto';
import { UpdatePrioridadDto } from './dto/update-prioridad.dto';

@Injectable()
export class PrioridadService {
  create(createPrioridadDto: CreatePrioridadDto) {
    return 'This action adds a new prioridad';
  }

  findAll() {
    return `This action returns all prioridad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prioridad`;
  }

  update(id: number, updatePrioridadDto: UpdatePrioridadDto) {
    return `This action updates a #${id} prioridad`;
  }

  remove(id: number) {
    return `This action removes a #${id} prioridad`;
  }
}
