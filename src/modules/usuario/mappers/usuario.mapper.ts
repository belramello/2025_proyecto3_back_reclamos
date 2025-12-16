import { Injectable } from '@nestjs/common';
import { Usuario, UsuarioDocumentType } from '../schema/usuario.schema';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { RespuestaUsuarioDto } from '../dto/respuesta-usuario.dto';
import { EmpleadoDto } from '../dto/empleado-de-subarea.dto';

@Injectable()
export class UsersMapper {
  public toDocument(dto: CreateUsuarioDto): Partial<Usuario> {
    return {
      nombreUsuario: dto.nombreUsuario,
      email: dto.email,
      contraseña: dto.contraseña,
      nombre: dto.nombre,
      //apellido: dto.apellido, // Agregamos apellido al guardar también
      direccion: dto.direccion,
      telefono: dto.telefono,
      // Nota: Si quieres guardar subarea aquí, deberías descomentarlo, 
      // pero el repositorio ya lo maneja manualmente en el create.
    };
  }

  public toEmpleadoDto(usuario: UsuarioDocumentType): EmpleadoDto {
    return {
      id: String(usuario._id),
      nombre: usuario.nombre,
      //apellido: usuario.apellido, // ¡Dejamos pasar el apellido!
      email: usuario.email,       // ¡Dejamos pasar el email!
      subarea: usuario.subarea,   // ¡Dejamos pasar el objeto subarea completo!
    };
  }

  public toEmpleadoDtoOrNull(
    usuario: UsuarioDocumentType | undefined,
  ): EmpleadoDto | null {
    if (!usuario) return null;
    return this.toEmpleadoDto(usuario);
  }

  public toEmpleadoDtos(usuarios: UsuarioDocumentType[]): EmpleadoDto[] {
    return usuarios.map((usuario) => {
      return this.toEmpleadoDto(usuario);
    });
  }

  public toResponseDto(usuario: UsuarioDocumentType): RespuestaUsuarioDto {
    
    const estadoCalculado = usuario.tokenActivacion ? "Pendiente" : "Activo";

    return new RespuestaUsuarioDto({
      id: String(usuario._id),
      nombreUsuario: usuario.nombreUsuario,
      email: usuario.email,
      rol: usuario.rol,
      nombre: usuario.nombre,
      direccion: usuario.direccion,
      telefono: usuario.telefono,
      
      // Enviamos el campo calculado al frontend
      estado: estadoCalculado, 

      // Si alguna vez usas este DTO para ver detalles, descomenta esto:
      // subarea: usuario.subarea, 
    });
  }
  // ------------------------------------------------

  public toPartialEntity(dto: UpdateUsuarioDto): Partial<Usuario> {
    return {
      nombreUsuario: dto.nombreUsuario,
      nombre: dto.nombre,
      direccion: dto.direccion,
      telefono: dto.telefono,
    };
  }
}