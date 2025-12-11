import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IReclamosRepository } from './reclamos-repository.interface';
import { Reclamo, ReclamoDocumentType } from '../schemas/reclamo.schema';
import { HistorialAsignacionService } from '../../../modules/historial-asignacion/historial-asignacion.service';
import { Usuario } from '../../../modules/usuario/schema/usuario.schema';
import { Subarea } from '../../../modules/subareas/schemas/subarea.schema';
import { TipoAsignacionesEnum } from '../../../modules/historial-asignacion/enums/tipoAsignacionesEnum';
import { HistorialEstadoService } from '../../../modules/historial-estado/historial-estado.service';
import { TipoCreacionHistorialEnum } from '../../../modules/historial-estado/enums/tipo-creacion-historial.enum';
import { forwardRef, Inject, NotFoundException } from '@nestjs/common';
import { Area } from '../../../modules/areas/schemas/area.schema';
import { AreasService } from 'src/modules/areas/areas.service';
import { EstadosEnum } from 'src/modules/estados/enums/estados-enum';

export class ReclamosRepository implements IReclamosRepository {
  constructor(
    @InjectModel(Reclamo.name)
    private readonly reclamoModel: Model<ReclamoDocumentType>,
    private readonly historialAsignacionService: HistorialAsignacionService,
    @Inject(forwardRef(() => HistorialEstadoService))
    private readonly historialEstadoService: HistorialEstadoService,
    private readonly areaService: AreasService,
  ) {}

  async create(reclamo: ReclamoDocumentType, areaDestino: Area) {
    //cuando se cree el ReclamoDocumentType, pasarle eso al nuevoHistorial. Ahora se está pasando como parámetro en el método, pero en realidad se tiene que pasar lo que se guarde en la base de datos y BORRAR EL PARÁMETRO DEL METODO CREATE.
    //EL AREA DESTINO QUE TAMB SE RECIBE COMO PARÁMETRO EN REALIDAD SE TIENE QUE DETERMINAR DE ACUERDO AL TIPO DE RECLAMO. TIENE QUE HABER UNA VINCULACIÓN ENTRE EL TIPO DE RECLAMO Y EL ÁREA EN QUE CAE DE ACUERDO AL TIPO.
    const nuevoHistorial = {
      reclamo: reclamo, //aca esta reclamo q le llega por parametro, pero en realidad le tiene que llegar el reclamo que se guarda en la base de datos.
      haciaArea: areaDestino,
      tipoAsignacion: TipoAsignacionesEnum.INICIAL,
    };
    const nuevoHistorialAsignacion =
      await this.historialAsignacionService.create(nuevoHistorial);
    await this.actualizarHistorialAsignacionActual(
      String(nuevoHistorialAsignacion._id),
      reclamo,
    );
    const nuevoHistorialEstado = await this.historialEstadoService.create({
      reclamo: reclamo,
      tipo: TipoCreacionHistorialEnum.INICIAL_PENDIENTE_A_ASIGNAR,
    });
    await this.actualizarHistorialEstadoActual(
      String(nuevoHistorialEstado._id),
      reclamo,
    );
  }

  async autoasignar(
    reclamo: ReclamoDocumentType,
    empleado: Usuario,
    subarea: Subarea,
    estado: string,
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
      if (estado == EstadosEnum.PENDIENTE_A_ASIGNAR) {
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
      }
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

  async consultarHistorialReclamo(
    reclamoId: string,
  ): Promise<ReclamoDocumentType> {
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
      if (!reclamo) {
        throw new NotFoundException(`No se encontró el reclamo ${reclamoId}`);
      }
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

  async asignarReclamoAArea(
    reclamo: ReclamoDocumentType,
    areaOrigen: Area,
    areaDestino: Area,
    comentario?: string,
  ): Promise<void> {
    try {
      const nuevoHistorialA = {
        reclamo: reclamo,
        desdeArea: areaOrigen,
        haciaArea: areaDestino,
        comentario: comentario,
        historialACerrarId: String(reclamo.ultimoHistorialAsignacion._id),
        tipoAsignacion: TipoAsignacionesEnum.DE_AREA_A_AREA,
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

  async asignarReclamoAEmpleado(
    reclamo: ReclamoDocumentType,
    encargado: Usuario,
    subareaDeEmpleado: Subarea,
    empleado: Usuario,
    estado: string,
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
      if (estado == EstadosEnum.PENDIENTE_A_ASIGNAR) {
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
      }
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

  async obtenerReclamosAsignadosDeEmpleado(empleadoId: string): Promise<any[]> {
    try {
      const objectId = new Types.ObjectId(empleadoId);

      return await this.reclamoModel.aggregate([
        // 1) Join historial_asignaciones
        {
          $lookup: {
            from: 'historial_asignaciones',
            localField: 'ultimoHistorialAsignacion',
            foreignField: '_id',
            as: 'asig',
          },
        },
        { $unwind: '$asig' },
        {
          $lookup: {
            from: 'historial_estado',
            localField: 'ultimoHistorialEstado',
            foreignField: '_id',
            as: 'estado',
          },
        },
        { $unwind: '$estado' },
        {
          $lookup: {
            from: 'estados',
            localField: 'estado.estado',
            foreignField: '_id',
            as: 'estadoDetalle',
          },
        },
        { $unwind: '$estadoDetalle' },
        {
          $lookup: {
            from: 'proyectos',
            localField: 'proyecto',
            foreignField: '_id',
            as: 'proyectoDetalle',
          },
        },
        {
          $unwind: {
            path: '$proyectoDetalle',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'usuarios',
            localField: 'cliente',
            foreignField: '_id',
            as: 'clienteDetalle',
          },
        },
        {
          $unwind: {
            path: '$clienteDetalle',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            'asig.haciaEmpleado': objectId,
            'asig.fechaHoraFin': null,
            'estadoDetalle.nombre': EstadosEnum.EN_PROCESO,
          },
        },
      ]);
    } catch (error) {
      console.error('Error al obtener reclamos asignados:', error);
      throw error;
    }
  }

  async obtenerReclamosAsignadosAUnArea(nombreArea: string): Promise<any[]> {
    try {
      const area = await this.areaService.findOneByNombre(nombreArea);
      if (!area) {
        throw new NotFoundException(`No se encontró el área ${nombreArea}`);
      }
      const objectId = new Types.ObjectId(area._id);
      return await this.reclamoModel.aggregate([
        // 1) Join historial_asignaciones
        {
          $lookup: {
            from: 'historial_asignaciones',
            localField: 'ultimoHistorialAsignacion',
            foreignField: '_id',
            as: 'asig',
          },
        },
        { $unwind: '$asig' },

        // 2) Join historial_estado
        {
          $lookup: {
            from: 'historial_estado',
            localField: 'ultimoHistorialEstado',
            foreignField: '_id',
            as: 'estado',
          },
        },
        { $unwind: '$estado' },

        // 3) Detalle del estado
        {
          $lookup: {
            from: 'estados',
            localField: 'estado.estado',
            foreignField: '_id',
            as: 'estadoDetalle',
          },
        },
        { $unwind: '$estadoDetalle' },

        // 4) Join proyecto
        {
          $lookup: {
            from: 'proyectos',
            localField: 'proyecto',
            foreignField: '_id',
            as: 'proyectoDetalle',
          },
        },
        {
          $unwind: {
            path: '$proyectoDetalle',
            preserveNullAndEmptyArrays: true,
          },
        },

        // 5) Join cliente
        {
          $lookup: {
            from: 'usuarios',
            localField: 'cliente',
            foreignField: '_id',
            as: 'clienteDetalle',
          },
        },
        {
          $unwind: {
            path: '$clienteDetalle',
            preserveNullAndEmptyArrays: true,
          },
        },

        // 6) FILTRO: asignado actualmente a un área
        {
          $match: {
            'asig.haciaArea': objectId,
            'asig.haciaEmpleado': null,
            'asig.haciaSubarea': null,
            'asig.fechaHoraFin': null,
            'asig.tipoAsignacion': {
              $in: [
                'Inicial',
                'AsignacionDeAreaAArea',
                'AsignacionDeEmpleadoAArea',
              ],
            },
          },
        },

        // 7) FILTRO: estado actual NO es "Resuelto"
        {
          $match: {
            'estadoDetalle.nombre': { $ne: 'Resuelto' },
          },
        },
      ]);
    } catch (error) {
      console.error('Error al obtener reclamos asignados a área:', error);
      throw error;
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
