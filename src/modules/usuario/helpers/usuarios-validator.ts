import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../schema/usuario.schema';
import { RolesEnum } from 'src/modules/roles/enums/roles-enum';
import { SubareasService } from 'src/modules/subareas/subareas.service';
import { Types } from 'mongoose'; // Necesitamos importar Types para el tipado fuerte
@Injectable()
export class UsuariosValidator {
  constructor(
    @Inject(forwardRef(() => UsuarioService))
    private readonly usuariosService: UsuarioService,
    @Inject(forwardRef(() => SubareasService))
    private readonly subareasService: SubareasService,
  ) {}

  // --- VALIDACIONES DE EXISTENCIA Y ROLES ---

  async validateUsuarioExistente(usuarioId: string): Promise<Usuario> {
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

  async validateEncargadoExistente(usuarioId: string): Promise<Usuario> {
    const encargado = await this.validateUsuarioExistente(usuarioId);
    
    if (encargado.rol.nombre !== RolesEnum.ENCARGADO_DE_AREA) {
      throw new UnauthorizedException(`El usuario no tiene rol de Encargado de Área.`);
    }
    // Validación de Integridad
    if (!encargado.area) {
      throw new BadRequestException(`El Encargado (ID: ${usuarioId}) no tiene un área asignada. Error de integridad.`);
    }
    return encargado;
  }

  async validateAdminExistente(usuarioId: string): Promise<Usuario> {
    const admin = await this.validateUsuarioExistente(usuarioId);
    
    if (admin.rol.nombre !== RolesEnum.ADMINISTRADOR) {
      throw new UnauthorizedException(`Se requieren permisos de ADMINISTRADOR para realizar esta acción.`);
    }
    return admin;
  }

  async validateClienteExistente(clienteId: string): Promise<Usuario> {
    const cliente = await this.validateUsuarioExistente(clienteId);
    if (cliente.rol.nombre !== RolesEnum.CLIENTE) {
      throw new BadRequestException(`El usuario asignado no tiene rol de CLIENTE.`);
    }
    return cliente;
  }

  // --- VALIDACIONES DE JERARQUÍA (ÁREA / SUBÁREA) ---

  async validateSubareaAsignadaAEmpleado(usuario: Usuario) {
    if (!usuario.subarea) {
      throw new UnauthorizedException(`El usuario no tiene subarea asignada.`);
    }
    return usuario.subarea;
  }

  async validateAreaAsignadaAEncargado(usuario: Usuario) {
    if (!usuario.area) {
      throw new UnauthorizedException(`El usuario no tiene area asignada.`);
    }
    return usuario.area;
  }

  async validateSubareaDeEncargado(subareaId: string, encargado: Usuario): Promise<void> {
    // 1. Buscamos la subárea
    const subarea = await this.subareasService.findOne(subareaId);
    if (!subarea) {
      throw new NotFoundException(`La Subárea con ID ${subareaId} no existe.`);
    }

    // 2. Verificamos que el encargado tenga área (Type Guard)
    if (!encargado.area) {
        throw new BadRequestException('El encargado no tiene un área asignada para validar.');
    }

    // 3. Extracción segura de IDs sin usar 'any'
    // Definimos un tipo temporal que tiene _id, para decirle a TS que confié en nosotros.
    type DocWithId = { _id: Types.ObjectId; nombre?: string };

    // Obtenemos el ID del Area de la Subarea
    // (Verificamos si está populado o si es un string directo)
    const areaSubareaObj = subarea.area as unknown as DocWithId;
    const areaSubareaId = areaSubareaObj._id ? String(areaSubareaObj._id) : String(subarea.area);

    // Obtenemos el ID del Area del Encargado
    const areaEncargadoObj = encargado.area as unknown as DocWithId;
    const areaEncargadoId = areaEncargadoObj._id ? String(areaEncargadoObj._id) : String(encargado.area);

    // 4. Comparamos
    if (areaSubareaId !== areaEncargadoId) {
      const nombreArea = areaEncargadoObj.nombre || 'Área del Encargado';
      throw new UnauthorizedException(
        `La subárea '${subarea.nombre}' no pertenece al área '${nombreArea}' del Encargado. No tienes permiso para asignar empleados aquí.`
      );
    }
  }

  async validateNoCliente(usuarioId: string): Promise<Usuario> {
    const usuario = await this.validateUsuarioExistente(usuarioId);
    if (usuario.rol.nombre === RolesEnum.CLIENTE) {
      throw new UnauthorizedException(`El usuario es un cliente.`);
    }
    return usuario;
  }
}