import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RespuestaUsuarioDto } from './dto/respuesta-usuario.dto';
import type { IUsuarioRepository } from './repository/usuario-repository.interface';
import { UsersMapper } from './mappers/usuario.mapper';
import { UsuarioDocumentType } from './schema/usuario.schema';
import { RolesValidator } from '../roles/helpers/roles-validator';
import { UsuariosValidator } from './helpers/usuarios-validator';
import { EmpleadoDeSubareaDto } from './dto/empleado-de-subarea.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuariosRepository: IUsuarioRepository,
    private readonly usuarioMappers: UsersMapper,
    @Inject(forwardRef(() => UsuariosValidator))
    private readonly usuariosValidator: UsuariosValidator,
    private readonly rolesValidator: RolesValidator,
  ) {}

  async create(
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    const rol = await this.rolesValidator.validateRolExistente(
      createUsuarioDto.rol,
    );
    const usuario = await this.usuariosRepository.create(createUsuarioDto, rol);
    console.log('usuario creado:', usuario);
    return this.usuarioMappers.toResponseDto(usuario);
  }

  async findAll(): Promise<RespuestaUsuarioDto[]> {
    const usuarios: UsuarioDocumentType[] =
      await this.usuariosRepository.findAll();
    return usuarios.map((usuario) =>
      this.usuarioMappers.toResponseDto(usuario),
    );
  }

  async findOne(id: string): Promise<RespuestaUsuarioDto> {
    const usuario = await this.usuariosRepository.findOne(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    return this.usuarioMappers.toResponseDto(usuario);
  }

  async findOneForAuth(id: string): Promise<UsuarioDocumentType> {
    const usuario = await this.usuariosRepository.findOne(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    return usuario;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    const partialEntity = this.usuarioMappers.toPartialEntity(updateUsuarioDto);
    const usuarioActualizado = await this.usuariosRepository.update(
      id,
      partialEntity,
    );

    if (!usuarioActualizado) {
      throw new NotFoundException(
        `Usuario con ID "${id}" no encontrado para actualizar.`,
      );
    }
    return this.usuarioMappers.toResponseDto(usuarioActualizado);
  }

  async findAllEmpleadosDeSubareaDelUsuario(
    usuarioId: string,
  ): Promise<EmpleadoDeSubareaDto[]> {
    const usuario =
      await this.usuariosValidator.validateEmpleadoExistente(usuarioId);
    const subarea =
      await this.usuariosValidator.validateSubareaAsignadaAEmpleado(usuario);
    const empleados = await this.usuariosRepository.findAllEmpleadosDeSubarea(
      subarea.nombre,
    );
    return this.usuarioMappers.toEmpleadoDeSubareaDtos(empleados);
  }

  async findAllEmpleadosDeAreaDelUsuario(
    usuarioId: string,
  ): Promise<EmpleadoDeSubareaDto[]> {
    const usuario =
      await this.usuariosValidator.validateEncargadoExistente(usuarioId);
    const area =
      await this.usuariosValidator.validateAreaAsignadaAEncargado(usuario);
    const empleados = await this.usuariosRepository.findAllEmpleadosDeArea(
      area.nombre,
    );
    return this.usuarioMappers.toEmpleadoDeSubareaDtos(empleados);
  }

  async remove(id: string): Promise<void> {
    await this.usuariosRepository.remove(id);
  }

  async findByEmail(email: string): Promise<UsuarioDocumentType | null> {
    return await this.usuariosRepository.findByEmail(email);
  }
}
