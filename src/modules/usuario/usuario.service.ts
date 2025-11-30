import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RespuestaUsuarioDto } from './dto/respuesta-usuario.dto';
import type { IUsuarioRepository } from './repository/usuario-repository.interface';
import { UsersMapper } from './mappers/usuario.mapper';
import { UsuarioDocumentType } from './schema/usuario.schema';
import { RolesValidator } from '../roles/helpers/roles-validator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuariosRepository: IUsuarioRepository,
    private readonly usuarioMappers: UsersMapper,
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

  async remove(id: string): Promise<void> {
    await this.usuariosRepository.remove(id);
  }

  async findByEmail(email: string): Promise<UsuarioDocumentType | null> {
    return await this.usuariosRepository.findByEmail(email);
  }

  // --- (REGISTRAR CLIENTE) ---

  async createCliente(
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    // 1. Validar que el email no exista previamente
    const existe = await this.usuariosRepository.findByEmail(createUsuarioDto.email);
    if (existe) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    // 2. Validar Rol (El ID del rol debe venir en el DTO)
    const rol = await this.rolesValidator.validateRolExistente(
      createUsuarioDto.rol,
    );

    // 3. Generar contraseña temporal y hashearla
    const tempPassword = Math.random().toString(36).slice(-8); // Genera pass aleatoria
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // 4. Crear objeto con la contraseña hasheada (pisamos la que viene en el DTO)
    const usuarioConPass = {
      ...createUsuarioDto,
      contraseña: hashedPassword,
    };

    // 5. Guardar en Base de Datos usando el repositorio existente
    const nuevoUsuario = await this.usuariosRepository.create(usuarioConPass, rol);

    // 6. Simular envío de email (Requisito del proyecto)
    this.enviarEmailBienvenida(nuevoUsuario.email, tempPassword);

    return this.usuarioMappers.toResponseDto(nuevoUsuario);
  }
//esto desp lo tengo que borrar
  private enviarEmailBienvenida(email: string, tempPass: string) {
    console.log('================================================');
    console.log(`📧 SIMULANDO ENVÍO DE EMAIL A: ${email}`);
    console.log(`ℹ️ Asunto: Bienvenido al Sistema de Reclamos`);
    console.log(`🔗 Link de activación: http://localhost:3000/auth/set-password?email=${email}`);
    console.log(`🔑 Contraseña temporal generada: ${tempPass}`);
    console.log('================================================');
  }
}
