import { BadRequestException } from '@nestjs/common';
import { UserCreationStrategy } from './user-creation.strategy.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';


export class EncargadoCreationStrategy implements UserCreationStrategy {
  validate(dto: CreateUsuarioDto): void {
    if (!dto.area) {
      throw new BadRequestException('Para crear un Encargado, el area es obligatoria.');
    }
  }

  async prepareData(dto: CreateUsuarioDto): Promise<any> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + 24);

    const passTemp = crypto.randomBytes(16).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(passTemp, salt);

    return {
      ...dto,
      contraseña: hash,
      tokenActivacion: token,
      tokenExpiracion: expiracion,
    };
  }
}