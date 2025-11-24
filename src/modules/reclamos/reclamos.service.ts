import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto';
import type { IReclamosRepository } from './repositories/reclamos-repository.interface';
import { ReclamoDocumentType } from './schemas/reclamo.schema';
import { ReclamosValidator } from './helpers/reclamos-validator';
import { Usuario } from '../usuario/schema/usuario.schema';
import { HistorialEstado } from '../historial-estado/schema/historial-estado.schema';

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
    //Actualizar estado de PendieteAAsignar a EnProceso.
  }

  async actualizarHistorialEstadoActual(
    historial: HistorialEstado,
    reclamoId: string,
  ): Promise<void> {
    const reclamo =
      await this.reclamosValidator.validateReclamoExistente(reclamoId);
    return await this.reclamosRepository.actualizarHistorialEstadoActual(
      historial,
      reclamo,
    );
  }
}
