import { Injectable } from '@nestjs/common';
import { CreateNivelCriticidadDto } from './dto/create-nivel-criticidad.dto';
import { UpdateNivelCriticidadDto } from './dto/update-nivel-criticidad.dto';

@Injectable()
export class NivelCriticidadService {
  create(createNivelCriticidadDto: CreateNivelCriticidadDto) {
    return 'This action adds a new nivelCriticidad';
  }

  findAll() {
    return `This action returns all nivelCriticidad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nivelCriticidad`;
  }

  update(id: number, updateNivelCriticidadDto: UpdateNivelCriticidadDto) {
    return `This action updates a #${id} nivelCriticidad`;
  }

  remove(id: number) {
    return `This action removes a #${id} nivelCriticidad`;
  }
}
