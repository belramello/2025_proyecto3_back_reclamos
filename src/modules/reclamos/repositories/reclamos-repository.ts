import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IReclamosRepository } from './reclamos-repository.interface';
import { Reclamo, ReclamoDocumentType } from '../schemas/reclamo.schema';
import { HistorialAsignacionService } from 'src/modules/historial-asignacion/historial-asignacion.service';
import { Usuario } from 'src/modules/usuario/schema/usuario.schema';
import { Subarea } from 'src/modules/subareas/schemas/subarea.schema';
import { TipoAsignacionesEnum } from 'src/modules/historial-asignacion/enums/tipoAsignacionesEnum';
import { HistorialEstado } from 'src/modules/historial-estado/schema/historial-estado.schema';
import { HistorialAsignacion } from 'src/modules/historial-asignacion/schemas/historial-asignacion.schema';
import { HistorialEstadoService } from 'src/modules/historial-estado/historial-estado.service';
import { TipoCreacionHistorialEnum } from 'src/modules/historial-estado/enums/tipo-creacion-historial.enum';
import { forwardRef, Inject } from '@nestjs/common';

export class ReclamosRepository implements IReclamosRepository {
  constructor(
    @InjectModel(Reclamo.name)
    private readonly reclamoModel: Model<ReclamoDocumentType>,
    private readonly historialAsignacionService: HistorialAsignacionService,
    @Inject(forwardRef(() => HistorialEstadoService))
    private readonly historialEstadoService: HistorialEstadoService,
  ) {}

  async autoasignar(
    reclamo: ReclamoDocumentType,
    empleado: Usuario,
    subarea: Subarea,
  ): Promise<void> {
    try {
      const nuevoHistorial = {
        reclamo: reclamo,
        desdeEmpleado: empleado,
        desdeSubarea: subarea,
        haciaSubarea: subarea,
        desdeArea: subarea.area,
        haciaArea: subarea.area,
        tipoAsignacion: TipoAsignacionesEnum.AUTOASIGNACION,
      };
      const nuevoHistorialAsignacion =
        await this.historialAsignacionService.create(nuevoHistorial);
      await this.actualizarHistorialAsignacionActual(
        nuevoHistorialAsignacion,
        reclamo,
      );
      const nuevoHistorialEstado = await this.historialEstadoService.create({
        reclamo: reclamo,
        usuarioResponsable: empleado,
        tipo: TipoCreacionHistorialEnum.EN_PROCESO,
      });
      await this.actualizarHistorialEstadoActual(nuevoHistorialEstado, reclamo);

      //Tengo que crear un nuevo historial de asignacion.
      //Tengo que actualizar el último historial de estado del reclamo (setearle la fecha fin).
      //Tengo que crear un nuevo historial de estado con el estado de "En Proceso".
    } catch (error) {
      throw new Error(`Error al autoasignar reclamo: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<ReclamoDocumentType | null> {
    try {
      //agregar populate de otros campos si es necesario
      const reclamo = await this.reclamoModel
        .findById(id)
        .populate('ultimoHistorialAsignacion')
        .populate('ultimoHistorialAsignacion.haciaArea')
        .populate('ultimoHistorialAsignacion.haciaSubarea')
        .populate('ultimoHistorialEstado')
        .populate('ultimoHistorialEstado.estado')
        .exec();
      return reclamo;
    } catch (error) {
      throw new Error(
        `Error al obtener el reclamo con ID ${id}: ${error.message}`,
      );
    }
  }

  async actualizarHistorialEstadoActual(
    historial: HistorialEstado,
    reclamo: ReclamoDocumentType,
  ) {
    try {
      reclamo.ultimoHistorialEstado = historial;
      await reclamo.save();
    } catch (error) {
      throw new Error(
        `Error al actualizar el historial de estado actual: ${error.message}`,
      );
    }
  }

  async actualizarHistorialAsignacionActual(
    historial: HistorialAsignacion,
    reclamo: ReclamoDocumentType,
  ) {
    try {
      reclamo.ultimoHistorialAsignacion = historial;
      await reclamo.save();
    } catch (error) {
      throw new Error(
        `Error al actualizar el historial de asignacion actual: ${error.message}`,
      );
    }
  }
}
