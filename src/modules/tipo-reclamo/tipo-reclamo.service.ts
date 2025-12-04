import { Injectable } from '@nestjs/common';
import { CreateTipoReclamoDto } from './dto/create-tipo-reclamo.dto';
import { UpdateTipoReclamoDto } from './dto/update-tipo-reclamo.dto';

@Injectable()
export class TipoReclamoService {
  create(createTipoReclamoDto: CreateTipoReclamoDto) {
    return 'This action adds a new tipoReclamo';
  }

  findAll() {
    return `This action returns all tipoReclamo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoReclamo`;
  }

  update(id: number, updateTipoReclamoDto: UpdateTipoReclamoDto) {
    return `This action updates a #${id} tipoReclamo`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoReclamo`;
  }
}
