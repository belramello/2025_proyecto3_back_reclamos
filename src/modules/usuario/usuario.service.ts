import {
  ConflictException,
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
import { MailService } from '../mail/mail.service';
import { UserContext } from './strategies/user-context';
import { ProyectosService } from '../proyectos/proyectos.service';
import { RolesEnum } from '../roles/enums/roles-enum';
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
    private readonly mailService: MailService,
    private readonly userContext: UserContext,
    @Inject(forwardRef(() => ProyectosService))
    private readonly proyectosService: ProyectosService,
  ) {}

  // --- 1. TU MÉTODO DE CREACIÓN (STRATEGY + MAILING) ---
  async create(createUsuarioDto: CreateUsuarioDto): Promise<RespuestaUsuarioDto> {
    // 1. Validar Email Duplicado
    const existe = await this.usuariosRepository.findByEmail(createUsuarioDto.email);
    if (existe) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    // 2. Validar Rol Existente
    const rolEncontrado = await this.rolesValidator.validateRolExistente(createUsuarioDto.rol);
    const nombreRol = rolEncontrado.nombre;

    // 3. ESTRATEGIA: Obtener lógica según el rol
    const strategy = this.userContext.getStrategy(nombreRol);

    // 4. Validar reglas específicas (ej: subarea obligatoria)
    strategy.validate(createUsuarioDto);

    // 5. Preparar datos (Generar token y pass random si es cliente/empleado)
    const usuarioData = await strategy.prepareData(createUsuarioDto);

    // 6. Guardar Usuario
    const nuevoUsuario = await this.usuariosRepository.create(usuarioData, rolEncontrado);

    // 7. Enviar Mail si se generó token
    if (usuarioData.tokenActivacion) {
      await this.mailService.sendUserActivation(
        nuevoUsuario.email,
        usuarioData.tokenActivacion,
        nombreRol
      );
    }

    // 8. Crear Proyecto (si aplica y es Cliente)
    if (createUsuarioDto.proyecto && nombreRol === RolesEnum.CLIENTE) {
      await this.proyectosService.create({
        ...createUsuarioDto.proyecto,
        cliente: String(nuevoUsuario._id), // Asociamos el ID del nuevo usuario
      });
    }

    return this.usuarioMappers.toResponseDto(nuevoUsuario);
  }

  // --- 2. MÉTODO DE ACTIVACIÓN PROFESIONAL (TUYO) ---
  async activateUser(id: string, hashContraseña: string): Promise<void> {
    await this.usuariosRepository.update(id, {
      contraseña: hashContraseña,
      tokenActivacion: null,
      tokenExpiracion: null
    } as any);
    
    // Log opcional para seguimiento
    console.log(`Usuario ${id} activado exitosamente a las ${new Date()}`);
  }

  // --- 3. MÉTODOS DE BÚSQUEDA GENERAL ---

  async findAll(): Promise<RespuestaUsuarioDto[]> {
    const usuarios = await this.usuariosRepository.findAll();
    return usuarios.map((usuario) => this.usuarioMappers.toResponseDto(usuario));
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

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<RespuestaUsuarioDto> {
    const partialEntity = this.usuarioMappers.toPartialEntity(updateUsuarioDto);
    const usuarioActualizado = await this.usuariosRepository.update(id, partialEntity);

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

  // --- 4. MÉTODOS DE GESTIÓN DE EMPLEADOS (DE LA DEVELOP) ---
  // Estos métodos se conservan porque son necesarios para la funcionalidad de tus compañeros

  async findAllEmpleadosDeSubareaDelUsuario(
    usuarioId: string,
  ): Promise<EmpleadoDeSubareaDto[]> {
    const usuario = await this.usuariosValidator.validateEmpleadoExistente(usuarioId);
    
    // Nota: Si validateSubareaAsignadaAEmpleado devuelve algo diferente a lo esperado, revisar UsuariosValidator
    const subarea = await this.usuariosValidator.validateSubareaAsignadaAEmpleado(usuario);
    
    const empleados = await this.usuariosRepository.findAllEmpleadosDeSubarea(
      subarea.nombre,
    );
    return this.usuarioMappers.toEmpleadoDeSubareaDtos(empleados);
  }

  async findAllEmpleadosDeAreaDelUsuario(
    usuarioId: string,
  ): Promise<EmpleadoDeSubareaDto[]> {
    const usuario = await this.usuariosValidator.validateEncargadoExistente(usuarioId);
    
    const area = await this.usuariosValidator.validateAreaAsignadaAEncargado(usuario);
    
    const empleados = await this.usuariosRepository.findAllEmpleadosDeArea(
      area.nombre,
    );
    return this.usuarioMappers.toEmpleadoDeSubareaDtos(empleados);
  }
}