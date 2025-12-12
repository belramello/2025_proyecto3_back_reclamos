import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserCreationStrategy, StrategyContext } from './user-creation.strategy.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';

export class AdminCreationStrategy implements UserCreationStrategy {
  
  async validate(dto: CreateUsuarioDto, context?: StrategyContext): Promise<void> {
    if (!dto.contraseña) {
      throw new BadRequestException(
        'El Administrador requiere contraseña inicial obligatoria.',
      );
    }
  }

  async prepareData(dto: CreateUsuarioDto): Promise<any> {
    if (!dto.contraseña) {
      throw new InternalServerErrorException(
        'Error interno: Contraseña no proporcionada para Admin.',
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dto.contraseña, salt);

    return {
      ...dto,
      contraseña: hash,
      tokenActivacion: null,
      tokenExpiracion: null,
    };
  }
}