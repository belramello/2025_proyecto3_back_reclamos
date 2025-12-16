import {
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  UserCreationStrategy,
  StrategyContext,
} from './user-creation.strategy.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export class EmpleadoCreationStrategy implements UserCreationStrategy {
  async validate(
    dto: CreateUsuarioDto,
    context: StrategyContext,
  ): Promise<void> {
    const { actor, validators } = context;
    if (!actor) {
      throw new UnauthorizedException(
        'Se requiere autenticación para crear un empleado.',
      );
    }
    if (!validators) {
      throw new InternalServerErrorException(
        'Error interno: Validadores no disponibles en estrategia.',
      );
    }
    await validators.usuarios.validateEncargadoExistente(String(actor._id));
    //validar que el que está creando un empleado sea un encargado.
    //Validar que la subarea a la que se le está asignando corresponda a una subarea del área a la que pertenece el encargado.
    if (!dto.subarea) {
      throw new BadRequestException(
        'Para crear un Empleado, la Subárea es obligatoria.',
      );
    }

    await validators.usuarios.validateSubareaDeEncargado(dto.subarea, actor);
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
