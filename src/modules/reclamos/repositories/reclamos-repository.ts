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
import { Area } from 'src/modules/areas/schemas/area.schema';

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
        haciaEmpleado: empleado,
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
          populate: [
            { path: 'haciaArea' },
            { path: 'haciaSubarea' },
            { path: 'haciaEmpleado' },
          ],
        })
        .exec();
      return reclamo;
    } catch (error) {
      throw new Error(
        `Error al obtener el reclamo con ID ${id}: ${error.message}`,
      );
    }
  }

  async consultarHistorialReclamo(reclamoId: string) {
    try {
      const reclamo = await this.reclamoModel
        .findById(reclamoId)
        .populate({
          path: 'historialEstados',
          populate: {
            path: 'estado',
          },
        })
        .populate({
          path: 'historialAsignaciones',
          populate: [
            { path: 'haciaArea' },
            { path: 'desdeArea' },
            { path: 'desdeSubarea' },
            { path: 'haciaSubarea' },
            { path: 'deEmpleado' },
            { path: 'haciaEmpleado' },
          ],
        })
        .populate({
          path: 'ultimoHistorialEstado',
          populate: { path: 'estado' },
        })
        .populate({
          path: 'ultimoHistorialAsignacion',
          populate: [
            { path: 'haciaArea' },
            { path: 'desdeArea' },
            { path: 'desdeSubarea' },
            { path: 'haciaSubarea' },
            { path: 'deEmpleado' },
            { path: 'haciaEmpleado' },
          ],
        })
        .exec();

      return reclamo;
    } catch (error) {
      throw new Error(
        `Error al obtener el reclamo con ID ${reclamoId}: ${error.message}`,
      );
    }
  }

  async asignarReclamoASubarea(
    reclamo: ReclamoDocumentType,
    subarea: Subarea,
    comentario?: string,
  ): Promise<void> {
    try {
      const nuevoHistorialA = {
        reclamo: reclamo,
        haciaSubarea: subarea,
        desdeArea: subarea.area,
        haciaArea: subarea.area,
        comentario: comentario,
        historialACerrarId: String(reclamo.ultimoHistorialAsignacion._id),
        tipoAsignacion: TipoAsignacionesEnum.DE_AREA_A_SUBAREA,
      };
      const nuevoHistorialAsignacion =
        await this.historialAsignacionService.create(nuevoHistorialA);
      await this.actualizarHistorialAsignacionActual(
        String(nuevoHistorialAsignacion._id),
        reclamo,
      );
    } catch (error) {
      throw new Error(
        `Error al asignar el reclamo a la subarea: ${error.message}`,
      );
    }
  }

  async asignarReclamoAEmpleado(
    reclamo: ReclamoDocumentType,
    encargado: Usuario,
    subareaDeEmpleado: Subarea,
    empleado: Usuario,
    comentario?: string,
  ): Promise<void> {
    try {
      const nuevoHistorialA = {
        reclamo: reclamo,
        haciaSubarea: subareaDeEmpleado,
        desdeArea: subareaDeEmpleado.area,
        haciaArea: subareaDeEmpleado.area,
        haciaEmpleado: empleado,
        comentario: comentario,
        historialACerrarId: String(reclamo.ultimoHistorialAsignacion._id),
        tipoAsignacion: TipoAsignacionesEnum.DE_AREA_A_EMPLEADO,
      };
      const nuevoHistorialAsignacion =
        await this.historialAsignacionService.create(nuevoHistorialA);
      await this.actualizarHistorialAsignacionActual(
        String(nuevoHistorialAsignacion._id),
        reclamo,
      );
      const nuevoHistorialEstado = await this.historialEstadoService.create({
        reclamo: reclamo,
        usuarioResponsable: encargado,
        historiaACerrarId: String(reclamo.ultimoHistorialEstado._id),
        tipo: TipoCreacionHistorialEnum.EN_PROCESO,
      });
      await this.actualizarHistorialEstadoActual(
        String(nuevoHistorialEstado._id),
        reclamo,
      );
    } catch (error) {
      throw new Error(
        `Error al asignar el reclamo al empleado: ${error.message}`,
      );
    }
  }

  async reasignarReclamoAEmpleado(
    reclamo: ReclamoDocumentType,
    empleadoOrigen: Usuario,
    empleadoDestino: Usuario,
    subarea: Subarea,
    comentario?: string,
  ): Promise<void> {
    try {
      const nuevoHistorialA = {
        reclamo: reclamo,
        desdeSubarea: subarea,
        haciaSubarea: subarea,
        desdeArea: subarea.area,
        haciaArea: subarea.area,
        desdeEmpleado: empleadoOrigen,
        haciaEmpleado: empleadoDestino,
        comentario: comentario,
        historialACerrarId: String(reclamo.ultimoHistorialAsignacion._id),
        tipoAsignacion: TipoAsignacionesEnum.DE_EMPLEADO_A_EMPLEADO,
      };
      const nuevoHistorialAsignacion =
        await this.historialAsignacionService.create(nuevoHistorialA);
      await this.actualizarHistorialAsignacionActual(
        String(nuevoHistorialAsignacion._id),
        reclamo,
      );
    } catch (error) {
      throw new Error(
        `Error al reasignar el reclamo al empleado: ${error.message}`,
      );
    }
  }

  async reasignarReclamoASubarea(
    reclamo: ReclamoDocumentType,
    empleado: Usuario,
    subareaOrigen: Subarea,
    subareaDestino: Subarea,
    comentario?: string,
  ): Promise<void> {
    try {
      const nuevoHistorialA = {
        reclamo: reclamo,
        desdeSubarea: subareaOrigen,
        haciaSubarea: subareaDestino,
        desdeArea: subareaOrigen.area,
        haciaArea: subareaOrigen.area,
        desdeEmpleado: empleado,
        comentario: comentario,
        historialACerrarId: String(reclamo.ultimoHistorialAsignacion._id),
        tipoAsignacion: TipoAsignacionesEnum.DE_EMPLEADO_A_SUBAREA,
      };
      const nuevoHistorialAsignacion =
        await this.historialAsignacionService.create(nuevoHistorialA);
      await this.actualizarHistorialAsignacionActual(
        String(nuevoHistorialAsignacion._id),
        reclamo,
      );
    } catch (error) {
      throw new Error(
        `Error al reasignar el reclamo a la subarea: ${error.message}`,
      );
    }
  }

  async reasignarReclamoAArea(
    reclamo: ReclamoDocumentType,
    empleado: Usuario,
    subareaOrigen: Subarea,
    areaDestino: Area,
    comentario?: string,
  ): Promise<void> {
    try {
      const nuevoHistorialA = {
        reclamo: reclamo,
        desdeSubarea: subareaOrigen,
        desdeArea: subareaOrigen.area,
        haciaArea: areaDestino,
        desdeEmpleado: empleado,
        comentario: comentario,
        historialACerrarId: String(reclamo.ultimoHistorialAsignacion._id),
        tipoAsignacion: TipoAsignacionesEnum.DE_EMPLEADO_A_AREA,
      };
      const nuevoHistorialAsignacion =
        await this.historialAsignacionService.create(nuevoHistorialA);
      await this.actualizarHistorialAsignacionActual(
        String(nuevoHistorialAsignacion._id),
        reclamo,
      );
    } catch (error) {
      throw new Error(
        `Error al reasignar el reclamo al area: ${error.message}`,
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
