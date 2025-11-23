import { Injectable } from '@nestjs/common';
import { CreateHistorialEstadoDto } from './dto/create-historial-estado.dto';
import { UpdateHistorialEstadoDto } from './dto/update-historial-estado.dto';

@Injectable()
export class HistorialEstadoService {
  create(createHistorialEstadoDto: CreateHistorialEstadoDto) {
    return 'This action adds a new historialEstado';
  }

  findAll() {
    return `This action returns all historialEstado`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historialEstado`;
  }

  update(id: number, updateHistorialEstadoDto: UpdateHistorialEstadoDto) {
    return `This action updates a #${id} historialEstado`;
  }

  remove(id: number) {
    return `This action removes a #${id} historialEstado`;
  }
}
