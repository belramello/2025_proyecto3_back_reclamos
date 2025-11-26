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
import { EstadosEnum } from 'src/modules/estados/enums/estados-enum';
import { Usuario } from 'src/modules/usuario/schema/usuario.schema';
import { RolesEnum } from 'src/modules/roles/enums/roles-enum';
import { Subarea } from 'src/modules/subareas/schemas/subarea.schema';
import { Types } from 'mongoose';
import { Area } from 'src/modules/areas/schemas/area.schema';
import { SubareasValidator } from 'src/modules/subareas/helpers/subareas-validator';

@Injectable()
export class ReclamosValidator {
  constructor(
    @Inject(forwardRef(() => ReclamosService))
    private readonly reclamosService: ReclamosService,
    private readonly subareasValidator: SubareasValidator,
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

  async validateSubareaExistenteYValida(
    id: string,
    area: Area,
  ): Promise<Subarea> {
    const subarea = await this.subareasValidator.validateSubareaExistente(id);
    if (subarea.area.nombre !== area.nombre) {
      throw new UnauthorizedException(
        `El subarea a asignar no pertenece a la área del encargado`,
      );
    }
    return subarea;
  }

  async validateAreaReclamo(
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

  //verificar que no tome reclamos que no tienen una subarea asignada
  async validateAreaYSubareaReclamo(
    reclamo: Reclamo,
    empleado: Usuario,
  ): Promise<Subarea> {
    if (
      empleado.rol.nombre !== RolesEnum.EMPLEADO ||
      empleado.subarea == null
    ) {
      throw new UnauthorizedException(
        `El usuario no es un empleado o no tiene subarea asignada`,
      );
    } else if (
      !(reclamo.ultimoHistorialAsignacion instanceof Types.ObjectId) &&
      (reclamo.ultimoHistorialAsignacion.haciaSubarea == null ||
        empleado.subarea.nombre !==
          reclamo.ultimoHistorialAsignacion.haciaSubarea.nombre)
    ) {
      if (reclamo.ultimoHistorialAsignacion.haciaSubarea == null) {
        throw new UnauthorizedException(
          `El usuario no pertenece a la subárea asignada del reclamo o el reclamo no tiene una subarea asignada`,
        );
      }
    }
    return empleado.subarea;
  }
}
