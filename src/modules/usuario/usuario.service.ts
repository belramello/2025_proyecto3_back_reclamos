import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
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
import { RolesValidator } from '../roles/helpers/roles-validator';
import { MailService } from '../mail/mail.service';
import { UserContext } from './strategies/user-context';
import { ProyectosService } from '../proyectos/proyectos.service';
import { RolesEnum } from '../roles/enums/roles-enum';
import { UsuariosValidator } from './helpers/usuarios-validator';
import { EmpleadoDto } from './dto/empleado-de-subarea.dto';
import { ReclamosService } from '../reclamos/reclamos.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { RolesService } from '../roles/roles.service';
import { ConfigService } from '@nestjs/config';
import { SubareasValidator } from '../subareas/helpers/subareas-validator';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuariosRepository: IUsuarioRepository,
    private readonly usuarioMappers: UsersMapper,
    @Inject(forwardRef(() => UsuariosValidator))
    private readonly usuariosValidator: UsuariosValidator,
    private readonly rolesValidator: RolesValidator,
    private readonly subareaValidator: SubareasValidator,
    private readonly mailService: MailService,
    private readonly userContext: UserContext,
    @Inject(forwardRef(() => ProyectosService))
    private readonly proyectosService: ProyectosService,
    @Inject(forwardRef(() => ReclamosService))
    private readonly reclamosService: ReclamosService,
    private readonly rolesService: RolesService,
    private readonly configService:ConfigService,
  ) {}

  async create(
    createUsuarioDto: CreateUsuarioDto,
    actor?: UsuarioDocumentType, 
  ): Promise<RespuestaUsuarioDto> {
    const existe = await this.usuariosRepository.findByEmail(
      createUsuarioDto.email,
    );
    if (existe) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    const rolEncontrado = await this.rolesValidator.validateRolExistente(
      createUsuarioDto.rol,
    );

    if (createUsuarioDto.subarea) {
      await this.subareaValidator.validateSubareaExistente(
        createUsuarioDto.subarea,
      );
    }

    const nombreRol = rolEncontrado.nombre;

    const strategy = this.userContext.getStrategy(nombreRol);

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
        nombreRol,
      );
    }

    if (createUsuarioDto.proyecto && nombreRol === RolesEnum.CLIENTE) {
      await this.proyectosService.create({
        ...createUsuarioDto.proyecto,
        cliente: String(nuevoUsuario._id),
      }, actor);
    }

    return this.usuarioMappers.toResponseDto(nuevoUsuario);
  }

  async updateEmpleado(
    id: string,
    updateDto: UpdateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    const empleadoActual = await this.findOneForAuth(id);

    if (updateDto.email && updateDto.email !== empleadoActual.email) {
      const existe = await this.usuariosRepository.findByEmail(updateDto.email);
      if (existe) {
        throw new ConflictException(
          'El nuevo correo electrónico ya está en uso.',
        );
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiracion = new Date();
      expiracion.setHours(expiracion.getHours() + 24);

      const passTemp = crypto.randomBytes(10).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(passTemp, salt);

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
    const reclamosAsignados =
      await this.reclamosService.obtenerReclamosAsignados(id);

    if (reclamosAsignados && reclamosAsignados.length > 0) {
      throw new ConflictException(
        'No se puede eliminar al empleado porque tiene reclamos asignados en curso o pendientes.',
      );
    }

    await this.usuariosRepository.remove(id);
  }

  async activateUser(id: string, hashContraseña: string): Promise<void> {
    await this.usuariosRepository.update(id, {
      contraseña: hashContraseña,
      tokenActivacion: null,
      tokenExpiracion: null,
      estado: "Activo"
    } as any);

    console.log(`Usuario ${id} activado exitosamente a las ${new Date()}`);
  }

  // --- MODIFICADO: Devuelve { data, total, page, limit, totalPages } ---
  async findAll(paginationDto: PaginationDto): Promise<any> {
    
    // Limpieza de busqueda
    if (!paginationDto.busqueda || paginationDto.busqueda.trim() === '') {
        delete paginationDto.busqueda;
    }

    // Conversión de nombre de rol a ID
    if (paginationDto.rol) {
        const rolEntity = await this.rolesService.findByName(paginationDto.rol as any);
        if (rolEntity) {
            paginationDto.rol = rolEntity._id.toString();
        } else {
            // Si el rol no existe, ponemos un ID dummy para que no traiga nada
            paginationDto.rol = "000000000000000000000000"; 
        }
    }

    // Llamada al repositorio que ahora devuelve data y total
    const { data, total } = await this.usuariosRepository.findAll(paginationDto);
    
    // Mapeo a DTOs
    const dataMapped = data.map((usuario) =>
      this.usuarioMappers.toResponseDto(usuario),
    );

    // Calculo de páginas
    const limit = paginationDto.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
        data: dataMapped,
        total,
        page: paginationDto.page || 1,
        limit,
        totalPages
    };
  }
  // ------------------------------------------------------------

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

    if (!usuarioActualizado) {
      throw new NotFoundException(`Usuario no encontrado.`);
    }
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
    return this.usuarioMappers.toEmpleadoDtos(empleados);
  }

  async findAllEmpleadosDeAreaDelUsuario(
    usuarioId: string,
  ): Promise<EmpleadoDto[]> {
    // 1. Validaciones
    const usuario =
      await this.usuariosValidator.validateEncargadoExistente(usuarioId);

    const area =
      await this.usuariosValidator.validateAreaAsignadaAEncargado(usuario);

    // 2. Obtener empleados
    const empleados = await this.usuariosRepository.findAllEmpleadosDeArea(
      area.nombre,
    );
    
    // 3. Convertir a DTOs básicos
    const empleadosDtos = this.usuarioMappers.toEmpleadoDtos(empleados);

    // 4. Calcular Reclamos Asignados para cada uno
    const empleadosConReclamos = await Promise.all(
      empleadosDtos.map(async (dto) => {
        // Consultamos al servicio de reclamos
        const reclamos = await this.reclamosService.obtenerReclamosAsignados(dto.id);
        // Asignamos la cantidad (0 si es null)
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

      const existe = await this.usuariosRepository.findByEmail(updateDto.email);
      if (existe) {
        throw new ConflictException(
          'El nuevo correo electrónico ya está en uso.',
        );
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiracion = new Date();
      expiracion.setHours(expiracion.getHours() + 24);

      const passTemp = crypto.randomBytes(10).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(passTemp, salt);

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
    const encargado = await this.usuariosRepository.findByIdSimple(id);
    console.log('Encargado encontrado:', encargado);

    if (!encargado) {
      throw new NotFoundException('El encargado no existe.');
    }

    const areaObj = encargado.area as any;
    const areaId = areaObj?._id?.toString() || null;

    if (!areaId) {
      throw new ConflictException(
        'El encargado no tiene un área asignada, no se puede eliminar.',
      );
    }

    const encargadoRoleId = await this.rolesService.findByName(
      RolesEnum.ENCARGADO_DE_AREA,
    );

    if (!encargadoRoleId) {
      throw new InternalServerErrorException(
        'No se pudo encontrar el ID del rol de encargado.',
      );
    }

    const cantidadEncargados =
      await this.usuariosRepository.countByAreaAndRole(
        areaId,
        encargadoRoleId._id.toString(),
      );

    if (cantidadEncargados <= 1) {
      throw new ConflictException(
        'No se puede eliminar al encargado porque es el único en su área.',
      );
    }
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
}