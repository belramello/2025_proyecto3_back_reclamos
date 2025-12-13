import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UserCreationStrategy, StrategyContext } from './user-creation.strategy.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export class ClienteCreationStrategy implements UserCreationStrategy {
  
  async validate(dto: CreateUsuarioDto, context: StrategyContext): Promise<void> {
    const { actor, validators } = context;

    if (!actor) {
      throw new UnauthorizedException('Se requiere autenticación para registrar un Cliente.');
    }

    // CORRECCIÓN: Validar que existan los validadores
    if (!validators) {
      throw new InternalServerErrorException('Error interno: Validadores no disponibles en estrategia.');
    }

    await validators.usuarios.validateAdminExistente(String(actor._id));
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