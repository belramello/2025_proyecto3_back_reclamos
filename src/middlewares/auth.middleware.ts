import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../modules/jwt/jwt.service';
import { UsuarioService } from '../modules/usuario/usuario.service';
import { UsuarioDocumentType } from '../modules/usuario/schema/usuario.schema';

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
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        console.log('❌ AuthGuard: No hay header Authorization');
        throw new UnauthorizedException('El token no existe');
      }

      // --- CORRECCIÓN CLAVE ---
      // Limpiamos el prefijo "Bearer " si existe, para quedarnos solo con el token
      const token = authHeader.replace('Bearer ', '').trim();
      // ------------------------

      const payload = this.jwtService.getPayload(token);
      
      if (!payload) {
        console.log('❌ AuthGuard: Token inválido al decodificar');
        throw new UnauthorizedException('Token inválido');
      }

      if (!payload.sub) {
        console.log('❌ AuthGuard: Payload sin ID (sub)');
        throw new UnauthorizedException(
          'El payload del token no contiene el ID del usuario',
        );
      }

      const usuario = await this.usuarioService.findOneForAuth(
        String(payload.sub),
      );

      if (!usuario) {
        console.log(`❌ AuthGuard: Usuario no encontrado en BD para ID ${payload.sub}`);
        throw new UnauthorizedException('Usuario no encontrado');
      }

      request.usuario = usuario;
      return true;

    } catch (error) {
      // --- LOG DE ERROR REAL ---
      // Esto imprimirá en tu terminal EXACTAMENTE qué falló
      console.error('💣 Error fatal en AuthGuard:', error.message); 
      console.error(error); // Imprime el stack trace completo
      throw new UnauthorizedException('No autorizado');
    }
  }
}