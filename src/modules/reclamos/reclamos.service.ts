import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto';
import type { IReclamosRepository } from './repositories/reclamos-repository.interface';
import { Reclamo, ReclamoDocumentType } from './schemas/reclamo.schema';
import { ReclamosValidator } from './helpers/reclamos-validator';
import { Usuario, UsuarioDocumentType } from '../usuario/schema/usuario.schema';

@Injectable()
export class ReclamosService {
  constructor(
    @Inject('IReclamosRepository')
    private readonly reclamosRepository: IReclamosRepository,
    @Inject(forwardRef(() => ReclamosValidator))
    private readonly reclamosValidator: ReclamosValidator,
  ) {}

  create(createReclamoDto: CreateReclamoDto) {
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
    //Crear historial asignación de la reclamo a autoasignar
    //Actualizar estado de PendieteAAsignar a EnProceso.
  }
}
