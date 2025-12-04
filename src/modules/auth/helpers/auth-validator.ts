import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { comparePasswords } from './password-helper';
import { UsuarioService } from '../../../modules/usuario/usuario.service';
import {
  Usuario,
  UsuarioDocumentType,
} from '../../../modules/usuario/schema/usuario.schema';
import { RespuestaUsuarioDto } from '../../../modules/usuario/dto/respuesta-usuario.dto';
@Injectable()
export class AuthValidator {
  constructor(private readonly usuarioservice: UsuarioService) {}

  async validarEmailSinUsar(email: string): Promise<null> {
    const existingUser = await this.usuarioservice.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('El email ya está en uso');
    }
    return null;
  }

  async validarEmailExistente(email: string): Promise<UsuarioDocumentType> {
    const usuario: UsuarioDocumentType | null =
      await this.usuarioservice.findByEmail(email);
    if (!usuario) {
      throw new NotFoundException('Usuario con email no encontrado');
    }
    return usuario;
  }

  async validarContraseñaCorrecta(
    contraseñaIngresada: string,
    contraseñaHasheada: string,
  ) {
    const isPasswordValid = await comparePasswords(
      contraseñaIngresada,
      contraseñaHasheada,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Contraseña incorrecta');
    }
  }

  async validarUsuarioExistente(id: string): Promise<RespuestaUsuarioDto> {
    const user = await this.usuarioservice.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }
}
