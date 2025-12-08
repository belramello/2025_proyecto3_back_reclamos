import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UserCreationStrategy } from './user-creation.strategy.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';

export class AdminCreationStrategy implements UserCreationStrategy {
  validate(dto: CreateUsuarioDto): void {
    if (!dto.contraseña) {
      throw new BadRequestException('El Administrador requiere contraseña inicial obligatoria.');
    }
  }

  async prepareData(dto: CreateUsuarioDto): Promise<any> {
    // CORRECCIÓN: TypeScript necesita confirmar que la contraseña existe
    if (!dto.contraseña) {
      // Esto teóricamente no debería pasar si se llamó a validate() antes,
      // pero satisface al compilador y es una doble seguridad.
      throw new InternalServerErrorException('Error interno: Contraseña no proporcionada para Admin.');
    }

    const salt = await bcrypt.genSalt(10);
    // Ahora TypeScript sabe que dto.contraseña es un string seguro
    const hash = await bcrypt.hash(dto.contraseña, salt);

    return {
      ...dto,
      contraseña: hash,
      tokenActivacion: null,
      tokenExpiracion: null,
    };
  }
}