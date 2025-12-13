import {
  Usuario,
  UsuarioDocumentType,
} from '../../../modules/usuario/schema/usuario.schema';
import { ReclamoDocumentType } from '../schemas/reclamo.schema';
import { Subarea } from 'src/modules/subareas/schemas/subarea.schema';
import { Area } from 'src/modules/areas/schemas/area.schema';
import { CreateReclamoDto } from '../dto/create-reclamo.dto';
import { ProyectoDocument } from 'src/modules/proyectos/schemas/proyecto.schema';
import { TipoReclamoDocumentType } from 'src/modules/tipo-reclamo/schemas/tipo-reclamo.schema';
import { ReclamosDelClienteDto } from '../dto/reclamos-del-cliente.dto';

export interface IReclamosRepository {
  findOne(id: string): Promise<ReclamoDocumentType | null>;
  consultarHistorialReclamo(reclamoId: string): Promise<ReclamoDocumentType>;
  crearReclamo(
    reclamo: CreateReclamoDto,
    nroTicket: string,
    cliente: UsuarioDocumentType,
    proyecto: ProyectoDocument,
    tipoReclamo: TipoReclamoDocumentType,
  ): Promise<ReclamoDocumentType>;
  consultarHistorialReclamo(reclamoId: string);
  autoasignar(
    reclamo: ReclamoDocumentType,
    empleado: Usuario,
    subarea: Subarea,
    estado: string,
  ): Promise<void>;
  actualizarHistorialEstadoActual(
    historialId: string,
    reclamo: ReclamoDocumentType,
  ): Promise<void>;
  asignarReclamoASubarea(
    reclamo: ReclamoDocumentType,
    subarea: Subarea,
    comentario?: string,
  ): Promise<void>;
  asignarReclamoAArea(
    reclamo: ReclamoDocumentType,
    areaOrigen: Area,
    areaDestino: Area,
    comentario?: string,
  ): Promise<void>;
  asignarReclamoAEmpleado(
    reclamo: ReclamoDocumentType,
    encargado: Usuario,
    subareaDeEmpleado: Subarea,
    haciaEmpleado: Usuario,
    estado: string,
    comentario?: string,
  ): Promise<void>;
  reasignarReclamoAEmpleado(
    reclamo: ReclamoDocumentType,
    empleadoOrigen: Usuario,
    empleadoDestino: Usuario,
    subarea: Subarea,
    comentario?: string,
  ): Promise<void>;
  reasignarReclamoASubarea(
    reclamo: ReclamoDocumentType,
    empleado: Usuario,
    subareaOrigen: Subarea,
    subareaDestino: Subarea,
    comentario?: string,
  ): Promise<void>;
  reasignarReclamoAArea(
    reclamo: ReclamoDocumentType,
    empleado: Usuario,
    subareaOrigen: Subarea,
    areaDestino: Area,
    comentario?: string,
  ): Promise<void>;
  obtenerReclamosAsignadosDeEmpleado(empleadoId: string): Promise<any[]>;
  obtenerReclamosAsignadosAUnArea(nombreArea: string): Promise<any[]>;
  obtenerReclamosDelCliente(usuarioId: string): Promise<ReclamoDocumentType[]>;
}
