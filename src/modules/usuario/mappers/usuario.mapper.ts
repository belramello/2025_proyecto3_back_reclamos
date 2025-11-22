import { Injectable } from '@nestjs/common';
import { UsuarioDocumentType } from '../schema/usuario.schema';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { Usuario } from '../entity/usuario.entity';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { RespuestaUsuarioDto } from '../dto/respuesta-usuario.dto';

@Injectable()
export class UsersMapper {
  public toEntity(document: UsuarioDocumentType): Usuario {
    const entity = new Usuario();
    entity.id = document._id.toString();
    entity.nombreUsuario = document.nombreUsuario;
    entity.email = document.email;
    entity.rol = document.rol;
    entity.nombre = document.nombre;
    entity.direccion = document.direccion;
    entity.telefono = document.telefono;
    entity.subarea = document.subarea;
    entity.area = document.area;
    return entity;
  }
  public toDocument(dto: CreateUsuarioDto): Partial<UsuarioDocumentType> {
    return {
      nombreUsuario: dto.nombreUsuario,
      email: dto.email,
      contraseña: dto.contraseña,
      rol: dto.rol || 'default',
      nombre: dto.nombre,
      direccion: dto.direccion,
      telefono: dto.telefono,
      subarea: dto.subarea,
      area: dto.area,
    };
  }

  public toResponseDto(entity: Usuario): RespuestaUsuarioDto {
    return new RespuestaUsuarioDto({
      id: entity.id,
      nombreUsuario: entity.nombreUsuario,
      email: entity.email,
      rol: entity.rol,
      nombre: entity.nombre,
      direccion: entity.direccion,
      telefono: entity.telefono,
      subarea: entity.subarea,
      area: entity.area,
    });
  }
  public toPartialEntity(dto: UpdateUsuarioDto): Partial<Usuario> {
    return {
      nombreUsuario: dto.nombreUsuario,
      rol: dto.rol,
      nombre: dto.nombre,
      direccion: dto.direccion,
      telefono: dto.telefono,
      subarea: dto.subarea,
      area: dto.area,
    };
  }
}
