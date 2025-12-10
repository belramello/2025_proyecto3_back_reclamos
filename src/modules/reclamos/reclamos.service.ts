import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto';
import type { IReclamosRepository } from './repositories/reclamos-repository.interface';
import { ReclamoDocumentType } from './schemas/reclamo.schema';
import { ReclamosValidator } from './helpers/reclamos-validator';
import { Usuario } from '../usuario/schema/usuario.schema';

@Injectable()
export class ReclamosService {
  constructor(
    @Inject('IReclamosRepository')
    private readonly reclamosRepository: IReclamosRepository,
    @Inject(forwardRef(() => ReclamosValidator))
    private readonly reclamosValidator: ReclamosValidator,
  ) {}

  create(createReclamoDto: CreateReclamoDto) {
    //cuando se crea un estado, entonces hay que crear tamb un historial estado y un historial asignación (inicial).
    return 'This action adds a new reclamo';
  }

  findAll() {
    return `This action returns all reclamos`;
  }

  async findOne(id: string): Promise<ReclamoDocumentType | null> {
    return await this.reclamosRepository.findOne(id);
  }

  update(id: number, updateReclamoDto: UpdateReclamoDto) {
    return `This action updates a #${id} reclamo`;
  }

  remove(id: number) {
    return `This action removes a #${id} reclamo`;
  }

  async consultarHistorialReclamo(id: string) {
    await this.reclamosValidator.validateReclamoExistente(id);
    return await this.reclamosRepository.consultarHistorialReclamo(id);
  }

  async autoasignarReclamo(id: string, empleado: Usuario) {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    const estadoActual =
      await this.reclamosValidator.validateReclamoNoResuelto(reclamo);
    const subarea = await this.reclamosValidator.validateAreaYSubareaReclamo(
      reclamo,
      empleado,
    );
    return await this.reclamosRepository.autoasignar(
      reclamo,
      empleado,
      subarea,
      estadoActual,
    );
  }

  async asignarReclamoASubarea(
    id: string,
    empleado: Usuario,
    subareaId: string,
    comentario?: string,
  ) {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    await this.reclamosValidator.validateReclamoNoResuelto(reclamo);
    const area = await this.reclamosValidator.validateAreaReclamoParaEncargado(
      reclamo,
      empleado,
    );
    const subarea =
      await this.reclamosValidator.validateSubareaExistenteYValida(
        subareaId,
        area,
      );
    return await this.reclamosRepository.asignarReclamoASubarea(
      reclamo,
      subarea,
      comentario,
    );
  }

  async asignarReclamoAEmpleado(
    id: string,
    encargado: Usuario,
    empleadoId: string,
    comentario?: string,
  ) {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    const estadoActual =
      await this.reclamosValidator.validateReclamoNoResuelto(reclamo);
    const area = await this.reclamosValidator.validateAreaReclamoParaEncargado(
      reclamo,
      encargado,
    );
    const [subareaDeEmpleado, empleado] =
      await this.reclamosValidator.validateEmpleadoExistenteYValido(
        empleadoId,
        area,
      );
    return await this.reclamosRepository.asignarReclamoAEmpleado(
      reclamo,
      encargado,
      subareaDeEmpleado,
      empleado,
      estadoActual,
      comentario,
    );
  }

  async asignarReclamoAArea(
    id: string,
    encargado: Usuario,
    areaId: string,
    comentario?: string,
  ) {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    await this.reclamosValidator.validateReclamoNoResuelto(reclamo);
    const areaOrigen =
      await this.reclamosValidator.validateAreaReclamoParaEncargado(
        reclamo,
        encargado,
      );
    const areaDestino =
      await this.reclamosValidator.validateAreaExistente(areaId);
    return await this.reclamosRepository.asignarReclamoAArea(
      reclamo,
      areaOrigen,
      areaDestino,
      comentario,
    );
  }

  async reasignarReclamoAEmpleado(
    id: string,
    empleadoOrigen: Usuario,
    empleadoDestinoId: string,
    comentario?: string,
  ) {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    await this.reclamosValidator.validateReclamoEnProceso(reclamo);
    this.reclamosValidator.validateEmpleadoAsignado(reclamo, empleadoOrigen);
    const [empleadoDestino, subarea] =
      await this.reclamosValidator.validateEmpleadoExistenteYConSubarea(
        empleadoDestinoId,
        empleadoOrigen,
      );
    return await this.reclamosRepository.reasignarReclamoAEmpleado(
      reclamo,
      empleadoOrigen,
      empleadoDestino,
      subarea,
      comentario,
    );
  }

  async reasignarReclamoASubarea(
    id: string,
    empleado: Usuario,
    subareaId: string,
    comentario?: string,
  ) {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    await this.reclamosValidator.validateReclamoEnProceso(reclamo);
    const subareaOrigen =
      await this.reclamosValidator.validateEmpleadoConSubarea(empleado);
    this.reclamosValidator.validateEmpleadoAsignado(reclamo, empleado);
    const subareaDestino =
      await this.reclamosValidator.validateSubareaExistenteYValida(
        subareaId,
        subareaOrigen.area,
      );
    return await this.reclamosRepository.reasignarReclamoASubarea(
      reclamo,
      empleado,
      subareaOrigen,
      subareaDestino,
      comentario,
    );
  }

  async reasignarReclamoAArea(
    id: string,
    empleado: Usuario,
    areaId: string,
    comentario?: string,
  ) {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    await this.reclamosValidator.validateReclamoEnProceso(reclamo);
    const subareaOrigen =
      await this.reclamosValidator.validateEmpleadoConSubarea(empleado);
    this.reclamosValidator.validateEmpleadoAsignado(reclamo, empleado);
    const areaDestino =
      await this.reclamosValidator.validateAreaExistente(areaId);
    return await this.reclamosRepository.reasignarReclamoAArea(
      reclamo,
      empleado,
      subareaOrigen,
      areaDestino,
      comentario,
    );
  }

  async obtenerReclamosAsignados(empleadoId: string) {
    await this.reclamosValidator.validateEmpleadoExistente(empleadoId);
    return await this.reclamosRepository.obtenerReclamosAsignadosDeEmpleado(
      empleadoId,
    );
  }

  async obtenerReclamosPendientesDeArea(encargado: Usuario) {
    const area = await this.reclamosValidator.validateEncargado(encargado);
    return await this.reclamosRepository.obtenerReclamosPendientesDeArea(
      area.nombre,
    );
  }
}
