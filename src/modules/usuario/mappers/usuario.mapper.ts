import { Injectable } from '@nestjs/common';
import { Usuario, UsuarioDocumentType } from '../schema/usuario.schema';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { RespuestaUsuarioDto } from '../dto/respuesta-usuario.dto';

@Injectable()
export class UsersMapper {
  public toDocument(dto: CreateUsuarioDto): Partial<Usuario> {
    return {
      nombreUsuario: dto.nombreUsuario,
      email: dto.email,
      contraseña: dto.contraseña,
      nombre: dto.nombre,
      direccion: dto.direccion,
      telefono: dto.telefono,
      //subarea: dto.subarea,
      //area: dto.area,
    };
  }

  public toResponseDto(usuario: UsuarioDocumentType): RespuestaUsuarioDto {
    return new RespuestaUsuarioDto({
      id: String(usuario._id),
      nombreUsuario: usuario.nombreUsuario,
      email: usuario.email,
      rol: usuario.rol,
      nombre: usuario.nombre,
      direccion: usuario.direccion,
      telefono: usuario.telefono,
      //subarea?: usuario.subarea?.nombre,
      //area: usuario.area,
    });
  }
  public toPartialEntity(dto: UpdateUsuarioDto): Partial<Usuario> {
    return {
      nombreUsuario: dto.nombreUsuario,
      nombre: dto.nombre,
      direccion: dto.direccion,
      telefono: dto.telefono,
      //subarea?: dto.subarea,
      //area?: dto.area,
    };
  }
}
