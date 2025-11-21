/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Usuario } from '../../usuario/entity/usuario.entity';
import { IUsuarioAuth } from '../interface/usuario-auth.interface';
import { comparePasswords } from './password-helper';
import { UsuarioService } from 'src/modules/usuario/usuario.service';

export class AuthValidator {
  constructor(private readonly usuarioservice: UsuarioService) {}

  async validarEmailSinUsar(email: string): Promise<null> {
    const existingUser = await this.usuarioservice.findOne(email);
    if (existingUser) {
      throw new BadRequestException('El email ya está en uso');
    }
    return null;
  }

  async validarEmailExistente(email: string): Promise<IUsuarioAuth> {
    const usuario = await this.usuarioservice.findByEmailForAuth(email);
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

  async validarUsuarioExistente(id: string): Promise<Usuario> {
    // Para el token refresh, solo necesitamos la entidad limpia (sin contraseña)
    const user = await this.usuarioservice.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }
}
