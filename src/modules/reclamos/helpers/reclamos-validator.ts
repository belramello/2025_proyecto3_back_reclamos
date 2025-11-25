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
import { HistorialAsignacion } from 'src/modules/historial-asignacion/schemas/historial-asignacion.schema';

@Injectable()
export class ReclamosValidator {
  constructor(
    @Inject(forwardRef(() => ReclamosService))
    private readonly reclamosService: ReclamosService,
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
      reclamo.ultimoHistorialAsignacion instanceof HistorialAsignacion &&
      empleado.subarea.nombre !==
        reclamo.ultimoHistorialAsignacion.haciaSubarea?.nombre
    ) {
      if (reclamo.ultimoHistorialAsignacion.haciaSubarea !== null) {
        throw new UnauthorizedException(
          `El usuario no pertenece a la subárea asignada del reclamo`,
        );
      }
    }
    return empleado.subarea;
  }
}
