import { Injectable } from '@nestjs/common';
import { RespuestaUsuarioDto } from '../../../modules/usuario/dto/respuesta-usuario.dto';
import { Usuario } from '../../usuario/entity/usuario.entity';
import { IUsuarioAuth } from '../interface/usuario-auth.interface';

type LoginUsuario = RespuestaUsuarioDto | Usuario | IUsuarioAuth;

@Injectable()
export class AuthMapper {
  toLoginResponseDto(
    accessToken: string,
    refreshToken: string,
    usuario: LoginUsuario,
  ) {
    return {
      accessToken,
      refreshToken,
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email,
        // rol: usuario.rol.nombre,
        // permisos: usuario.rol.permisos.map((permiso) => permiso.id),
      },
    };
  }
}
