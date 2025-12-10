import { InjectModel } from '@nestjs/mongoose';
import { Model, Types,Document } from 'mongoose';
import { IReclamosRepository } from './reclamos-repository.interface';
import { Reclamo, ReclamoDocumentType } from '../schemas/reclamo.schema';
import { HistorialAsignacionService } from '../../../modules/historial-asignacion/historial-asignacion.service';
import { Usuario } from '../../../modules/usuario/schema/usuario.schema';
import { Subarea } from '../../../modules/subareas/schemas/subarea.schema';
import { TipoAsignacionesEnum } from '../../../modules/historial-asignacion/enums/tipoAsignacionesEnum';
import { HistorialEstadoService } from '../../../modules/historial-estado/historial-estado.service';
import { TipoCreacionHistorialEnum } from '../../../modules/historial-estado/enums/tipo-creacion-historial.enum';
import {
  forwardRef,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Area } from '../../../modules/areas/schemas/area.schema';
import { AreasService } from 'src/modules/areas/areas.service';
import { EstadosEnum } from 'src/modules/estados/enums/estados-enum';
import { CreateReclamoDto } from '../dto/create-reclamo.dto';
import { RolesEnum } from 'src/modules/roles/enums/roles-enum';

export class ReclamosRepository implements IReclamosRepository {
  constructor(
    @InjectModel(Reclamo.name)
    private readonly reclamoModel: Model<ReclamoDocumentType>,
    private readonly historialAsignacionService: HistorialAsignacionService,
    @Inject(forwardRef(() => HistorialEstadoService))
    private readonly historialEstadoService: HistorialEstadoService,
    private readonly areaService: AreasService,
  ) {}

  async crearReclamo(reclamoDto: CreateReclamoDto,cliente: Usuario & Document,): Promise<ReclamoDocumentType> {
    if (cliente.rol.nombre !== RolesEnum.CLIENTE) {
      throw new UnauthorizedException('Solo los clientes pueden registrar reclamos.');
    }

    const estadoInicial = EstadosEnum.PENDIENTE_A_ASIGNAR;
    const { proyecto, tipoReclamo, ...restOfReclamoData } = reclamoDto;

    const reclamoData = {
      ...restOfReclamoData,
      cliente: cliente._id,
      proyecto: new Types.ObjectId(proyecto),
      tipoReclamo: new Types.ObjectId(tipoReclamo),
      estado: estadoInicial,
      fechaCreacion: new Date(),
      historialEstados: [
        {
          estado: estadoInicial,
          fecha: new Date(),
          usuario: cliente._id,
        },
      ],
    };

    const nuevoReclamo = new this.reclamoModel(reclamoData);
    const reclamoCreado = await nuevoReclamo.save();

    try {
      const nroTicket = reclamoCreado.nroTicket;
      // this.emailService.sendTicketConfirmation(cliente.email, nroTicket);
      // this.asignacionService.determinarYAsignar(reclamoCreado);
    } catch (error) {
      console.error(
        `Advertencia: Reclamo creado (${reclamoCreado._id}), pero falló el proceso de post-creación.`,
        error,
      );
    }

    return reclamoCreado;
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

  async obtenerReclamosAsignadosDeEmpleado(
    empleadoId: string,
  ): Promise<ReclamoDocumentType[] | null> {
    try {
      return await this.reclamoModel
        .find({
          'ultimoHistorialAsignacion.haciaEmpleado': empleadoId,
          'ultimoHistorialAsignacion.fechaHoraFin': { $exists: false },
          'ultimoHistorialEstado.estado.nombre': EstadosEnum.EN_PROCESO,
        })
        .exec();
    } catch (error) {
      console.error('Error al obtener reclamos asignados:', error);
      throw error;
    }
  }

  async obtenerReclamosPendientesDeArea(nombreArea: string) {
    const area = await this.areaService.findOneByNombre(nombreArea);

    try {
      if (!area) {
        throw new NotFoundException(`No se encontró el área ${nombreArea}`);
      }

      const reclamos = await this.reclamoModel
        .find()
        .populate({
          path: 'ultimoHistorialEstado',
          populate: { path: 'estado' },
        })
        .populate({
          path: 'ultimoHistorialAsignacion',
          populate: [{ path: 'haciaArea' }],
        });

      console.log('reclamos traídos:', reclamos);

      const reclamosFiltrados = reclamos.filter((r) => {
        const estadoPendiente =
          (r.ultimoHistorialEstado as any)?.estado?.nombre ===
          'Pendiente a Asignar';

        const asignacion = r.ultimoHistorialAsignacion as any;

        const asignacionCorrecta =
          asignacion &&
          asignacion.haciaArea?._id.toString() === area._id.toString() &&
          !asignacion.fechaHoraFin;

        return estadoPendiente && asignacionCorrecta;
      });
      console.log('filtrados:', reclamosFiltrados);
      return reclamosFiltrados;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener reclamos pendientes: ${error.message}`,
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
