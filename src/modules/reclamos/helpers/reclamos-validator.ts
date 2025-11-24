import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ReclamosService } from '../reclamos.service';
import { Reclamo } from '../schemas/reclamo.schema';
import { EstadosEnum } from 'src/modules/estados/enums/estados-enum';
import { Usuario } from 'src/modules/usuario/schema/usuario.schema';
import { RolesEnum } from 'src/modules/roles/enums/roles-enum';
import { Subarea } from 'src/modules/subareas/schemas/subarea.schema';

@Injectable()
export class ReclamosValidator {
  constructor(
    @Inject(forwardRef(() => ReclamosService))
    private readonly reclamosService: ReclamosService,
  ) {}

  async validateReclamoExistente(id: string): Promise<Reclamo> {
    const reclamo = await this.reclamosService.findOne(id);
    if (!reclamo) {
      throw new Error(`El reclamo con ID ${id} no existe`);
    }
    return reclamo;
  }

  async validateReclamoPendienteAAsignar(reclamo: Reclamo): Promise<void> {
    if (
      reclamo.ultimoHistorialEstado.estado.nombre !==
      EstadosEnum.PENDIENTE_A_ASIGNAR
    ) {
      throw new Error(
        `El reclamo con ID ${reclamo._id} no está en estado Pendiente A Asignar`,
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
      throw new Error(
        `El usuario no es un empleado o no tiene subarea asignada`,
      );
    } else if (
      empleado.subarea.nombre !==
      reclamo.ultimoHistorialAsignacion.haciaSubarea?.nombre
    ) {
      throw new Error(
        `El usuario no pertenece a la subárea asignada del reclamo`,
      );
    }
    return empleado.subarea;
  }
}
