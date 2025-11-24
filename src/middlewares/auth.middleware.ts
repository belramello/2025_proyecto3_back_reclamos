import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../modules/jwt/jwt.service';
import { UsuarioService } from '../modules/usuario/usuario.service';
import { UsuarioDocumentType } from 'src/modules/usuario/schema/usuario.schema';

export interface RequestWithUsuario extends Request {
  usuario: UsuarioDocumentType;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usuarioService: UsuarioService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: RequestWithUsuario = context.switchToHttp().getRequest();
      const token = request.headers.authorization;
      console.log('token:', token);
      if (!token) {
        throw new UnauthorizedException('El token no existe');
      }
      const payload = this.jwtService.getPayload(token);
      console.log('payload:', payload);
      if (!payload) {
        throw new UnauthorizedException('Token inválido');
      }
      console.log('payload.sub:', payload.sub);
      if (!payload.sub) {
        throw new UnauthorizedException(
          'El payload del token no contiene el ID del usuario',
        );
      }
      const usuario = await this.usuarioService.findOneForAuth(
        String(payload.sub),
      );
      console.log('usuario:', usuario);
      if (!usuario) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      request.usuario = usuario;
      return true;
    } catch (error) {
      throw new UnauthorizedException('No autorizado');
    }
  }
}
