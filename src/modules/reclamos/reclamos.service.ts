import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto';
import type { IReclamosRepository } from './repositories/reclamos-repository.interface';
import { ReclamoDocumentType } from './schemas/reclamo.schema';
import { ReclamosValidator } from './helpers/reclamos-validator';
import { Usuario } from '../usuario/schema/usuario.schema';
import { HistorialEstadoDocumentType } from '../historial-estado/schema/historial-estado.schema';

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

  async autoasignarReclamo(id: string, empleado: Usuario) {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    await this.reclamosValidator.validateReclamoPendienteAAsignar(reclamo);
    const subarea = await this.reclamosValidator.validateAreaYSubareaReclamo(
      reclamo,
      empleado,
    );
    return await this.reclamosRepository.autoasignar(
      reclamo,
      empleado,
      subarea,
    );
  }

  async asignarReclamoASubarea(
    id: string,
    empleado: Usuario,
    subareaId: string,
  ) {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    await this.reclamosValidator.validateReclamoPendienteAAsignar(reclamo);
    const area = await this.reclamosValidator.validateAreaReclamo(
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
    );
  }

  async asignarReclamoAEmpleado(
    id: string,
    encargado: Usuario,
    empleadoId: string,
  ) {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    await this.reclamosValidator.validateReclamoPendienteAAsignar(reclamo);
    const area = await this.reclamosValidator.validateAreaReclamo(
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
    );
  }

  async reasignarReclamoAEmpleado(
    id: string,
    empleadoOrigen: Usuario,
    empleadoDestinoId: string,
  ) {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    await this.reclamosValidator.validateReclamoEnProceso(reclamo);
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
    );
  }

  async actualizarHistorialEstadoActual(
    historial: HistorialEstadoDocumentType,
    reclamoId: string,
  ): Promise<void> {
    const reclamo =
      await this.reclamosValidator.validateReclamoExistente(reclamoId);
    return await this.reclamosRepository.actualizarHistorialEstadoActual(
      String(historial._id),
      reclamo,
    );
  }
}
