import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ReclamosService } from '../reclamos.service';
import { Reclamo, ReclamoDocumentType } from '../schemas/reclamo.schema';
import { EstadosEnum } from '../../../modules/estados/enums/estados-enum';
import { Usuario } from '../../../modules/usuario/schema/usuario.schema';
import { RolesEnum } from '../../../modules/roles/enums/roles-enum';
import { Subarea } from '../../../modules/subareas/schemas/subarea.schema';
import { Types } from 'mongoose';
import { Area } from '../../../modules/areas/schemas/area.schema';
import { SubareasValidator } from '../../../modules/subareas/helpers/subareas-validator';
import { UsuariosValidator } from '../../../modules/usuario/helpers/usuarios-validator';
import { AreasValidator } from '../../../modules/areas/helpers/areas-validator';

@Injectable()
export class ReclamosValidator {
  constructor(
    @Inject(forwardRef(() => ReclamosService))
    private readonly reclamosService: ReclamosService,
    private readonly subareasValidator: SubareasValidator,
    private readonly usuariosValidator: UsuariosValidator,
    private readonly areasValidator: AreasValidator,
  ) {}

  async validateReclamoExistente(id: string): Promise<ReclamoDocumentType> {
    const reclamo = await this.reclamosService.findOne(id);
    if (!reclamo) {
      throw new NotFoundException(`El reclamo con ID ${id} no existe`);
    }
    return reclamo;
  }

  async validateReclamoPendienteAAsignar(
    reclamo: ReclamoDocumentType,
  ): Promise<void> {
    if (reclamo.ultimoHistorialEstado instanceof Types.ObjectId) {
      throw new BadRequestException('No se puede validar el estado actual');
    }
    if (
      reclamo.ultimoHistorialEstado.estado?.nombre !==
      EstadosEnum.PENDIENTE_A_ASIGNAR
    ) {
      throw new BadRequestException(
        'El reclamo no está en estado Pendiente A Asignar',
      );
    }
    return;
  }

  async validateAreaExistente(areaId: string): Promise<Area> {
    const area = await this.areasValidator.validateAreaExistente(areaId);
    return area;
  }

  async validateReclamoEnProceso(reclamo: ReclamoDocumentType): Promise<void> {
    if (reclamo.ultimoHistorialEstado instanceof Types.ObjectId) {
      throw new BadRequestException('No se puede validar el estado actual');
    }
    if (
      reclamo.ultimoHistorialEstado.estado?.nombre !== EstadosEnum.EN_PROCESO
    ) {
      throw new BadRequestException(
        'No se puede reasignar un reclamo que está en proceso',
      );
    }
    return;
  }

  //Validar subárea perteneciente a área determinada.
  async validateSubareaExistenteYValida(
    id: string,
    area: Area,
  ): Promise<Subarea> {
    const subarea = await this.subareasValidator.validateSubareaExistente(id);
    if (subarea.area.nombre !== area.nombre) {
      throw new UnauthorizedException(
        `El subarea a asignar no pertenece a la área del usuario.`,
      );
    }
    return subarea;
  }

  //valida que el reclamo esté asignado al área al que pertenece el encargado. Falla si está asignado a subarea.
  async validateAreaReclamoParaEncargado(
    reclamo: Reclamo,
    encargado: Usuario,
  ): Promise<Area> {
    if (
      encargado.rol.nombre !== RolesEnum.ENCARGADO_DE_AREA ||
      !encargado.area
    ) {
      throw new UnauthorizedException(
        `El usuario no es un encargado de área o no tiene un área asignada`,
      );
    }
    const ultimaAsignacion = reclamo.ultimoHistorialAsignacion;
    if (
      !(ultimaAsignacion instanceof Types.ObjectId) &&
      encargado.area.nombre !== ultimaAsignacion.haciaArea?.nombre
    ) {
      throw new UnauthorizedException(
        `El usuario no pertenece al área asignada del reclamo`,
      );
    }
    if (
      !(ultimaAsignacion instanceof Types.ObjectId) &&
      ultimaAsignacion.haciaSubarea !== null
    ) {
      throw new UnauthorizedException(
        `El reclamo está asignado a una subárea, no a un encargado de área`,
      );
    }
    return encargado.area;
  }

  //valida que el usuario exista y que pertenece al área asignada del reclamo.
  async validateEmpleadoExistenteYValido(
    empleadoId: string,
    area: Area,
  ): Promise<[Subarea, Usuario]> {
    const [empleado, subareaEmpleado] =
      await this.validateEmpleadoExistente(empleadoId);
    if (subareaEmpleado.area.nombre !== area.nombre) {
      throw new UnauthorizedException(
        `El usuario no pertenece al área asignada del reclamo`,
      );
    }
    return [subareaEmpleado, empleado];
  }

  //valida que el usuario exista y sea un empleado con una subárea asignada.
  async validateEmpleadoExistente(
    empleadoId: string,
  ): Promise<[Usuario, Subarea]> {
    const empleado =
      await this.usuariosValidator.validateEmpleadoExistente(empleadoId);
    if (empleado.rol.nombre !== RolesEnum.EMPLEADO) {
      throw new UnauthorizedException(`El usuario no es un empleado`);
    }
    if (!empleado.subarea) {
      throw new UnauthorizedException(
        `El empleado no tiene una subarea asignada`,
      );
    }
    return [empleado, empleado.subarea];
  }

  async validateEmpleadoConSubarea(empleado: Usuario): Promise<Subarea> {
    if (
      empleado.rol.nombre !== RolesEnum.EMPLEADO ||
      empleado.subarea == null
    ) {
      throw new UnauthorizedException(
        `El usuario no es un empleado o no tiene subarea asignada`,
      );
    }
    return empleado.subarea;
  }

  //verificar que no tome reclamos que no tienen una subarea asignada
  async validateAreaYSubareaReclamo(
    reclamo: Reclamo,
    empleado: Usuario,
  ): Promise<Subarea> {
    const subareaEmpleado = await this.validateEmpleadoConSubarea(empleado);
    if (
      !(reclamo.ultimoHistorialAsignacion instanceof Types.ObjectId) &&
      (reclamo.ultimoHistorialAsignacion.haciaSubarea == null ||
        subareaEmpleado.nombre !==
          reclamo.ultimoHistorialAsignacion.haciaSubarea.nombre)
    ) {
      if (reclamo.ultimoHistorialAsignacion.haciaSubarea == null) {
        throw new UnauthorizedException(
          `El usuario no pertenece a la subárea asignada del reclamo o el reclamo no tiene una subarea asignada`,
        );
      }
    }
    return subareaEmpleado;
  }
  validateMismaSubarea(
    subareaEmpleadoOrigen: Subarea,
    subareaEmpleadoDestino: Subarea,
  ): void {
    if (subareaEmpleadoOrigen.nombre !== subareaEmpleadoDestino.nombre) {
      throw new BadRequestException(
        `El usuario está intentando reasignar el reclamo a un empleado que no se encuentra en su misma subárea.`,
      );
    }
  }

  validateEmpleadoAsignado(
    reclamo: ReclamoDocumentType,
    empleado: Usuario,
  ): void {
    if (reclamo.ultimoHistorialAsignacion instanceof Types.ObjectId) {
      throw new BadRequestException(
        `No es posible acceder a la ultima asignación del reclamo`,
      );
    }
    const ultimaAsignacion = reclamo.ultimoHistorialAsignacion;
    if (
      ultimaAsignacion.haciaEmpleado?.nombreUsuario !== empleado.nombreUsuario
    ) {
      throw new BadRequestException(
        `El usuario no tiene asignado el reclamo que desea asignar.`,
      );
    }
  }

  async validateEmpleadoExistenteYConSubarea(
    empleadoDestinoId: string,
    empleadoOrigen: Usuario,
  ): Promise<[Usuario, Subarea]> {
    const [empleadoDestino, subareaEmpleadoDestino] =
      await this.validateEmpleadoExistente(empleadoDestinoId);
    const subareaEmpleadoOrigen =
      await this.validateEmpleadoConSubarea(empleadoOrigen);
    this.validateMismaSubarea(subareaEmpleadoOrigen, subareaEmpleadoDestino);
    return [empleadoDestino, subareaEmpleadoDestino];
  }
}
