import { Injectable } from '@nestjs/common';
import { RespuestaUsuarioDto } from '../../../modules/usuario/dto/respuesta-usuario.dto';
import { IUsuarioAuth } from '../interface/usuario-auth.interface';
import { Usuario } from 'src/modules/usuario/schema/usuario.schema';

type LoginUsuario = RespuestaUsuarioDto | Usuario | IUsuarioAuth;

@Injectable()
export class AuthMapper {
  toLoginResponseDto(
    accessToken: string,
    refreshToken: string,
    usuario: LoginUsuario,
  ) {
    console.log(usuario);
    return {
      accessToken,
      refreshToken,
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol.nombre,
        permisos: usuario.rol.permisos.map((permiso) => permiso),
      },
    };
  }
}
