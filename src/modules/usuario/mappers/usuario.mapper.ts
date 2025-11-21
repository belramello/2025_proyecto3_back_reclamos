import { Injectable } from '@nestjs/common';
import { UsuarioDocumentType } from '../schema/usuario.schema';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { Usuario } from '../entity/usuario.entity';

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
}
