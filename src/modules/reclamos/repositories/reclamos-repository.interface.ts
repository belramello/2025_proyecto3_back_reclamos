import { Usuario } from 'src/modules/usuario/schema/usuario.schema';
import { ReclamoDocumentType } from '../schemas/reclamo.schema';
import { Subarea } from 'src/modules/subareas/schemas/subarea.schema';
import { Area } from 'src/modules/areas/schemas/area.schema';
import { Estado } from 'src/modules/estados/schemas/estado.schema';
import { EstadosEnum } from 'src/modules/estados/enums/estados-enum';

export interface IReclamosRepository {
  findOne(id: string): Promise<ReclamoDocumentType | null>;
  consultarHistorialReclamo(reclamoId: string);
  autoasignar(
    reclamo: ReclamoDocumentType,
    empleado: Usuario,
    subarea: Subarea,
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
    encargado: Usuario,
    areaOrigen: Area,
    areaDestino: Area,
    estado: string,
    comentario?: string,
  ): Promise<void>;
  asignarReclamoAEmpleado(
    reclamo: ReclamoDocumentType,
    encargado: Usuario,
    subareaDeEmpleado: Subarea,
    haciaEmpleado: Usuario,
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
  obtenerReclamosAsignadosDeEmpleado(
    empleadoId: string,
  ): Promise<ReclamoDocumentType[] | null>;
  obtenerReclamosPendientesDeArea(nombreArea: string);
}
