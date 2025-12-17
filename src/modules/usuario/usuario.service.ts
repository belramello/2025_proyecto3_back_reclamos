import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RespuestaUsuarioDto } from './dto/respuesta-usuario.dto';
import type { IUsuarioRepository } from './repository/usuario-repository.interface';
import { UsersMapper } from './mappers/usuario.mapper';
import { UsuarioDocumentType } from './schema/usuario.schema';
import { MailService } from '../mail/mail.service';
import { UserContext } from './strategies/user-context';
import { ProyectosService } from '../proyectos/proyectos.service';
import { RolesEnum } from '../roles/enums/roles-enum';
import { UsuariosValidator } from './helpers/usuarios-validator';
import { EmpleadoDto } from './dto/empleado-de-subarea.dto';
import { ReclamosService } from '../reclamos/reclamos.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { UsuariosHelper } from './helpers/usuarios-helper';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuariosRepository: IUsuarioRepository,
    private readonly usuarioMappers: UsersMapper,
    @Inject(forwardRef(() => UsuariosValidator))
    private readonly usuariosValidator: UsuariosValidator,
    private readonly mailService: MailService,
    private readonly userContext: UserContext,
    @Inject(forwardRef(() => ProyectosService))
    private readonly proyectosService: ProyectosService,
    @Inject(forwardRef(() => ReclamosService))
    private readonly reclamosService: ReclamosService,
    private readonly configService: ConfigService,
    private readonly usuarioHelper: UsuariosHelper,
    private readonly rolesService: RolesService,
  ) {}

  async create(
    createUsuarioDto: CreateUsuarioDto,
    actor?: UsuarioDocumentType,
  ): Promise<RespuestaUsuarioDto> {
    await this.usuariosValidator.validateEmailNoUsado(createUsuarioDto.email);
    const rolEncontrado = await this.usuariosValidator.validateRolExistente(
      createUsuarioDto.rol,
    );
    if (createUsuarioDto.subarea) {
      await this.usuariosValidator.validateSubareaExistente(
        createUsuarioDto.subarea,
      );
    }
    const strategy = this.userContext.getStrategy(rolEncontrado.nombre);
    await strategy.validate(createUsuarioDto, {
      actor: actor,
      validators: {
        usuarios: this.usuariosValidator,
      },
    });
    const usuarioData = await strategy.prepareData(createUsuarioDto);
    const nuevoUsuario = await this.usuariosRepository.create(
      usuarioData,
      rolEncontrado,
    );
    if (usuarioData.tokenActivacion) {
      await this.mailService.sendUserActivation(
        nuevoUsuario.email,
        usuarioData.tokenActivacion,
        rolEncontrado.nombre,
      );
    }
    if (
      createUsuarioDto.proyecto &&
      rolEncontrado.nombre === RolesEnum.CLIENTE
    ) {
      await this.proyectosService.create(
        {
          ...createUsuarioDto.proyecto,
          cliente: String(nuevoUsuario._id),
        },
        actor,
      );
    }
    return this.usuarioMappers.toResponseDto(nuevoUsuario);
  }

  async updateEmpleado(
    id: string,
    updateDto: UpdateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    const empleadoActual = await this.findOneForAuth(id);
    if (updateDto.email && updateDto.email !== empleadoActual.email) {
      await this.usuariosValidator.validateEmailNoUsado(updateDto.email);
      const { hash, token, expiracion } =
        await this.usuarioHelper.generarToken();
      const dataAActualizar = {
        ...this.usuarioMappers.toPartialEntity(updateDto),
        email: updateDto.email,
        contraseña: hash,
        tokenActivacion: token,
        tokenExpiracion: expiracion,
      };
      const empleadoActualizado = await this.usuariosRepository.update(
        id,
        dataAActualizar,
      );
      const nombreRol = empleadoActual.rol
        ? (empleadoActual.rol as any).nombre || RolesEnum.EMPLEADO
        : RolesEnum.EMPLEADO;
      await this.mailService.sendUserActivation(
        empleadoActualizado.email,
        token,
        nombreRol,
      );
      return this.usuarioMappers.toResponseDto(empleadoActualizado);
    } else {
      return this.update(id, updateDto);
    }
  }

  async removeEmpleado(id: string): Promise<void> {
    await this.usuariosValidator.validateEmpleadoConAsignaciones(id);
    await this.usuariosRepository.remove(id);
  }

  async activateUser(id: string, hashContraseña: string): Promise<void> {
    await this.usuariosRepository.update(id, {
      contraseña: hashContraseña,
      tokenActivacion: null,
      tokenExpiracion: null,
      estado: 'Activo',
    } as any);
  }

  async findAll(paginationDto: PaginationDto): Promise<any> {
    if (!paginationDto.busqueda || paginationDto.busqueda.trim() === '') {
      delete paginationDto.busqueda;
    }

    if (paginationDto.rol) {
      const rolEntity = await this.rolesService.findByName(
        paginationDto.rol as any,
      );
      if (rolEntity) {
        paginationDto.rol = rolEntity._id.toString();
      } else {
        paginationDto.rol = '000000000000000000000000';
      }
    }

    const { data, total } =
      await this.usuariosRepository.findAll(paginationDto);
    console.log(data);
    const dataMapped = data.map((usuario) =>
      this.usuarioMappers.toResponseDto(usuario),
    );
    console.log(dataMapped);
    const limit = paginationDto.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      data: dataMapped,
      total,
      page: paginationDto.page || 1,
      limit,
      totalPages,
    };
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

  async findByToken(token: string): Promise<UsuarioDocumentType | null> {
    return await this.usuariosRepository.findByToken(token);
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
    return this.usuarioMappers.toResponseDto(usuarioActualizado);
  }

  async remove(id: string): Promise<void> {
    await this.usuariosRepository.remove(id);
  }

  async findByEmail(email: string): Promise<UsuarioDocumentType | null> {
    return await this.usuariosRepository.findByEmail(email);
  }

  async findAllEmpleadosDeSubareaDelUsuario(
    usuarioId: string,
  ): Promise<EmpleadoDto[]> {
    const usuario =
      await this.usuariosValidator.validateEmpleadoExistente(usuarioId);
    const subarea =
      await this.usuariosValidator.validateSubareaAsignadaAEmpleado(usuario);
    const empleados = await this.usuariosRepository.findAllEmpleadosDeSubarea(
      subarea.nombre,
    );
    const empleadosFiltrados = empleados.filter(
      (empleado) => empleado.id.toString() !== usuarioId,
    );
    return this.usuarioMappers.toEmpleadoDtos(empleadosFiltrados);
  }

  async findAllEmpleadosDeAreaDelUsuario(
    usuarioId: string,
  ): Promise<EmpleadoDto[]> {
    const usuario =
      await this.usuariosValidator.validateEncargadoExistente(usuarioId);
    const area =
      await this.usuariosValidator.validateAreaAsignadaAEncargado(usuario);
    const empleados = await this.usuariosRepository.findAllEmpleadosDeArea(
      area.nombre,
    );
    const empleadosDtos = this.usuarioMappers.toEmpleadoDtos(empleados);
    const empleadosConReclamos = await Promise.all(
      empleadosDtos.map(async (dto) => {
        const reclamos = await this.reclamosService.obtenerReclamosAsignados(
          dto.id,
        );
        dto.cantidadReclamos = reclamos ? reclamos.length : 0;
        return dto;
      }),
    );
    return empleadosConReclamos;
  }

  async updateEncargado(
    id: string,
    updateDto: UpdateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    const encargadoActual = await this.findOneForAuth(id);
    if (updateDto.email && updateDto.email !== encargadoActual.email) {
      await this.usuariosValidator.validateEmailNoUsado(updateDto.email);
      const { hash, token, expiracion } =
        await this.usuarioHelper.generarToken();
      const dataAActualizar = {
        ...this.usuarioMappers.toPartialEntity(updateDto),
        email: updateDto.email,
        contraseña: hash,
        tokenActivacion: token,
        tokenExpiracion: expiracion,
      };
      const encargadoActualizado = await this.usuariosRepository.update(
        id,
        dataAActualizar,
      );
      const nombreRol = encargadoActual.rol
        ? (encargadoActual.rol as any).nombre || RolesEnum.ENCARGADO_DE_AREA
        : RolesEnum.ENCARGADO_DE_AREA;
      await this.mailService.sendUserActivation(
        encargadoActualizado.email,
        token,
        nombreRol,
      );
      return this.usuarioMappers.toResponseDto(encargadoActualizado);
    } else {
      return this.update(id, updateDto);
    }
  }

  async removeEncargado(id: string): Promise<void> {
    const encargado =
      await this.usuariosValidator.validateEncargadoExistente(id);
    await this.usuariosValidator.validateEncargadoDisponibleParaEliminar(
      encargado,
    );
    await this.usuariosRepository.remove(id);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usuariosRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 3600000); //1 hora.
    await this.usuariosRepository.guardarTokenReset(email, token, expiration);
    const resetUrl = `${this.configService.get(
      'FRONTEND_URL',
    )}/reset-password?token=${token}`;
    await this.mailService.sendPasswordReset(email, user.nombre, resetUrl);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usuariosRepository.findOneByResetToken(token);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    if (
      !user.passwordResetExpiration ||
      user.passwordResetExpiration < new Date()
    ) {
      throw new BadRequestException('Token inválido o expirado');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await this.usuariosRepository.updatePassword(user.id, hashedPassword);
  }

  async contarReclamoPorAreaYRol(
    areaId: string,
    rolId: string,
  ): Promise<number> {
    return await this.usuariosRepository.countByAreaAndRole(areaId, rolId);
  }
}
