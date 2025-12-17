import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { UsuarioService } from '../usuario.service';
import { Usuario, UsuarioDocumentType } from '../schema/usuario.schema';
import { RolesEnum } from 'src/modules/roles/enums/roles-enum';
import { Types } from 'mongoose';
import {
  Subarea,
  SubareaDocumentType,
} from 'src/modules/subareas/schemas/subarea.schema';
import { Area, AreaDocumentType } from 'src/modules/areas/schemas/area.schema';
import { SubareasValidator } from 'src/modules/subareas/helpers/subareas-validator';
import { ReclamosService } from 'src/modules/reclamos/reclamos.service';
import { RolesValidator } from 'src/modules/roles/helpers/roles-validator';
import { RolDocumentType } from 'src/modules/roles/schema/rol.schema';
import { UsuariosHelper } from './usuarios-helper';
import { AreasValidator } from 'src/modules/areas/helpers/areas-validator';
@Injectable()
export class UsuariosValidator {
  constructor(
    @Inject(forwardRef(() => UsuarioService))
    private readonly usuariosService: UsuarioService,
    private readonly subareaValidator: SubareasValidator,
    private readonly reclamosService: ReclamosService,
    private readonly rolesValidator: RolesValidator,
    private readonly usuariosHelper: UsuariosHelper,
    private readonly areaValidator: AreasValidator,
  ) {}

  async validateUsuarioExistente(
    usuarioId: string,
  ): Promise<UsuarioDocumentType> {
    const usuario = await this.usuariosService.findOneForAuth(usuarioId);
    if (!usuario) {
      throw new NotFoundException(`El usuario con ID ${usuarioId} no existe`);
    }
    return usuario;
  }

  async validateEmpleadoExistente(empleadoId: string): Promise<Usuario> {
    const empleado = await this.validateUsuarioExistente(empleadoId);
    if (empleado.rol.nombre !== RolesEnum.EMPLEADO) {
      throw new UnauthorizedException(`El usuario no es un empleado`);
    }
    return empleado;
  }

  async validateEncargadoExistente(
    usuarioId: string,
  ): Promise<UsuarioDocumentType> {
    const encargado = await this.validateUsuarioExistente(usuarioId);
    if (encargado.rol.nombre !== RolesEnum.ENCARGADO_DE_AREA) {
      throw new UnauthorizedException(
        `El usuario no tiene rol de Encargado de Área.`,
      );
    }
    if (!encargado.area) {
      throw new BadRequestException(
        `El Encargado (ID: ${usuarioId}) no tiene un área asignada. Error de integridad.`,
      );
    }
    return encargado;
  }

  async validateAdminExistente(usuarioId: string): Promise<Usuario> {
    const admin = await this.validateUsuarioExistente(usuarioId);

    if (admin.rol.nombre !== RolesEnum.ADMINISTRADOR) {
      throw new UnauthorizedException(
        `Se requieren permisos de ADMINISTRADOR para realizar esta acción.`,
      );
    }
    return admin;
  }

  async validateClienteExistente(clienteId: string): Promise<Usuario> {
    const cliente = await this.validateUsuarioExistente(clienteId);
    if (cliente.rol.nombre !== RolesEnum.CLIENTE) {
      throw new BadRequestException(
        `El usuario asignado no tiene rol de CLIENTE.`,
      );
    }
    return cliente;
  }

  async validateSubareaAsignadaAEmpleado(usuario: Usuario): Promise<Subarea> {
    if (!usuario.subarea) {
      throw new UnauthorizedException(`El usuario no tiene subarea asignada.`);
    }
    return usuario.subarea;
  }

  async validateAreaAsignadaAEncargado(usuario: Usuario): Promise<Area> {
    if (!usuario.area) {
      throw new UnauthorizedException(`El usuario no tiene area asignada.`);
    }
    return usuario.area;
  }

  async validateSubareaDeEncargado(
    subareaId: string,
    encargado: Usuario,
  ): Promise<SubareaDocumentType> {
    const subarea = await this.validateSubareaExistente(subareaId);
    await this.validateAreaAsignadaAEncargado(encargado);
    type DocWithId = { _id: Types.ObjectId; nombre?: string };
    const areaSubareaObj = subarea.area as unknown as DocWithId;
    const areaSubareaId = areaSubareaObj._id
      ? String(areaSubareaObj._id)
      : String(subarea.area);
    const areaEncargadoObj = encargado.area as unknown as DocWithId;
    const areaEncargadoId = areaEncargadoObj._id
      ? String(areaEncargadoObj._id)
      : String(encargado.area);
    if (areaSubareaId !== areaEncargadoId) {
      const nombreArea = areaEncargadoObj.nombre || 'Área del Encargado';
      throw new UnauthorizedException(
        `La subárea '${subarea.nombre}' no pertenece al área '${nombreArea}' del Encargado. No tienes permiso para asignar empleados aquí.`,
      );
    }
    return subarea;
  }

  async validateNoCliente(usuarioId: string): Promise<Usuario> {
    const usuario = await this.validateUsuarioExistente(usuarioId);
    if (usuario.rol.nombre === RolesEnum.CLIENTE) {
      throw new UnauthorizedException(`El usuario es un cliente.`);
    }
    return usuario;
  }

  async validateEmailNoUsado(email: string): Promise<void> {
    const existe = await this.usuariosService.findByEmail(email);
    if (existe) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }
  }

  async validateEmpleadoConAsignaciones(empleadoId: string): Promise<void> {
    const reclamosAsignados =
      await this.reclamosService.obtenerReclamosAsignados(empleadoId);
    if (reclamosAsignados && reclamosAsignados.length > 0) {
      throw new ConflictException(
        'No se puede eliminar al empleado porque tiene reclamos asignados en curso o pendientes.',
      );
    }
  }

  async validateRolExistente(rol: string): Promise<RolDocumentType> {
    return await this.rolesValidator.validateRolExistente(rol);
  }

  async validateSubareaExistente(
    subareaId: string,
  ): Promise<SubareaDocumentType> {
    return await this.subareaValidator.validateSubareaExistente(subareaId);
  }

  async validateEncargadoDisponibleParaEliminar(
    encargado: UsuarioDocumentType,
  ): Promise<void> {
    const areaObj = encargado.area as any;
    const areaId = areaObj?._id?.toString() || null;
    const encargadoRol = await this.usuariosHelper.buscarRolEncargado(
      RolesEnum.ENCARGADO_DE_AREA,
    );
    const cantidadEncargados =
      await this.usuariosService.contarReclamoPorAreaYRol(
        areaId,
        encargadoRol._id.toString(),
      );
    if (cantidadEncargados <= 1) {
      throw new ConflictException(
        'No se puede eliminar al encargado porque es el único en su área.',
      );
    }
  }

  async validateAreaExistente(areaId: string): Promise<AreaDocumentType> {
    return await this.areaValidator.validateAreaExistente(areaId);
  }

  async validateTokenExistente(token: string): Promise<UsuarioDocumentType> {
    const user = await this.usuariosService.findOneByResetToken(token);
    if (!user) {
      throw new NotFoundException('Token inválido o usuario no encontrado.');
    }
    if (
      !user.passwordResetExpiration ||
      user.passwordResetExpiration < new Date()
    ) {
      throw new BadRequestException('Token inválido o expirado');
    }
    return user;
  }
}
