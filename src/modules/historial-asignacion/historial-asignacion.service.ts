import { Injectable } from '@nestjs/common';
import { CreateHistorialAsignacionDto } from './dto/create-historial-asignacion.dto';
import { UpdateHistorialAsignacionDto } from './dto/update-historial-asignacion.dto';

@Injectable()
export class HistorialAsignacionService {
  create(createHistorialAsignacionDto: CreateHistorialAsignacionDto) {
    return 'This action adds a new historialAsignacion';
  }

  findAll() {
    return `This action returns all historialAsignacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historialAsignacion`;
  }

  update(id: number, updateHistorialAsignacionDto: UpdateHistorialAsignacionDto) {
    return `This action updates a #${id} historialAsignacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} historialAsignacion`;
  }
}
