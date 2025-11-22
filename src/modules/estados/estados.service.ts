import { Injectable } from '@nestjs/common';

@Injectable()
export class EstadosService {
  create() {
    return 'This action adds a new estado';
  }

  findAll() {
    return `This action returns all estados`;
  }

  findOne() {
    return `This action returns a # estado`;
  }

  update() {
    return `This action updates a # estado`;
  }

  remove() {
    return `This action removes a #estado`;
  }
}
