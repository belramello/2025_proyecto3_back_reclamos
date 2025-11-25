import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IReclamosRepository } from './reclamos-repository.interface';
import { Reclamo, ReclamoDocumentType } from '../schemas/reclamo.schema';
import { HistorialAsignacionService } from 'src/modules/historial-asignacion/historial-asignacion.service';
import { Usuario } from 'src/modules/usuario/schema/usuario.schema';
import { Subarea } from 'src/modules/subareas/schemas/subarea.schema';
import { TipoAsignacionesEnum } from 'src/modules/historial-asignacion/enums/tipoAsignacionesEnum';
import { HistorialEstadoService } from 'src/modules/historial-estado/historial-estado.service';
import { TipoCreacionHistorialEnum } from 'src/modules/historial-estado/enums/tipo-creacion-historial.enum';
import { forwardRef, Inject } from '@nestjs/common';
import {
  HistorialEstado,
  HistorialEstadoDocumentType,
} from 'src/modules/historial-estado/schema/historial-estado.schema';

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
        historialACerrarId: String(reclamo.ultimoHistorialAsignacion._id),
        tipoAsignacion: TipoAsignacionesEnum.AUTOASIGNACION,
      };
      const nuevoHistorialAsignacion =
        await this.historialAsignacionService.create(nuevoHistorial);
      await this.actualizarHistorialAsignacionActual(
        String(nuevoHistorialAsignacion._id),
        reclamo,
      );
      const nuevoHistorialEstado = await this.historialEstadoService.create({
        reclamo: reclamo,
        usuarioResponsable: empleado,
        historiaACerrarId: String(reclamo.ultimoHistorialEstado._id),
        tipo: TipoCreacionHistorialEnum.EN_PROCESO,
      });
      await this.actualizarHistorialEstadoActual(
        String(nuevoHistorialEstado._id),
        reclamo,
      );
    } catch (error) {
      throw new Error(`Error al autoasignar reclamo: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<ReclamoDocumentType | null> {
    try {
      const reclamo = await this.reclamoModel
        .findById(id)
        .populate({
          path: 'ultimoHistorialEstado',
          populate: {
            path: 'estado',
          },
        })
        .populate({
          path: 'ultimoHistorialAsignacion',
          populate: [{ path: 'haciaArea' }, { path: 'haciaSubarea' }],
        })
        .exec();
      return reclamo;
    } catch (error) {
      throw new Error(
        `Error al obtener el reclamo con ID ${id}: ${error.message}`,
      );
    }
  }

  async actualizarHistorialEstadoActual(
    historialId: string,
    reclamo: ReclamoDocumentType,
  ) {
    try {
      reclamo.historialEstados.push(new Types.ObjectId(historialId));
      reclamo.ultimoHistorialEstado = new Types.ObjectId(historialId);
      await reclamo.save();
    } catch (error) {
      throw new Error(
        `Error al actualizar el historial de estado actual: ${error.message}`,
      );
    }
  }

  async actualizarHistorialAsignacionActual(
    historialId: string,
    reclamo: ReclamoDocumentType,
  ) {
    try {
      reclamo.historialAsignaciones.push(new Types.ObjectId(historialId));
      reclamo.ultimoHistorialAsignacion = new Types.ObjectId(historialId);
      await reclamo.save();
    } catch (error) {
      throw new Error(
        `Error al actualizar el historial de asignacion actual: ${error.message}`,
      );
    }
  }
}
