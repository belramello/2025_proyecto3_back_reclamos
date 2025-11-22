import { Injectable } from '@nestjs/common';
import { Usuario } from '../schema/usuario.schema';
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
      subarea: dto.subarea,
      area: dto.area,
    };
  }

  public toResponseDto(usuario: Usuario): RespuestaUsuarioDto {
    return new RespuestaUsuarioDto({
      id: (usuario as any)._id?.toString(),
      nombreUsuario: usuario.nombreUsuario,
      email: usuario.email,
      rol: usuario.rol,
      nombre: usuario.nombre,
      direccion: usuario.direccion,
      telefono: usuario.telefono,
      subarea: usuario.subarea,
      area: usuario.area,
    });
  }
  public toPartialEntity(dto: UpdateUsuarioDto): Partial<Usuario> {
    return {
      nombreUsuario: dto.nombreUsuario,
      nombre: dto.nombre,
      direccion: dto.direccion,
      telefono: dto.telefono,
      subarea: dto.subarea,
      area: dto.area,
    };
  }
}
