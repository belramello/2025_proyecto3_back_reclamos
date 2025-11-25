import { Inject, Injectable } from '@nestjs/common';
import { ICreacionHistorialStrategy } from './estados-strategies/creacion-historial-strategy.interface';
import type { IHistorialEstadoRepository } from './repositories/historial-estado-repository.interface';
import { CrearHistorialEstadoDto } from './dto/create-historial-estado.dto';
import { HistorialEstadoDocumentType } from './schema/historial-estado.schema';

@Injectable()
export class HistorialEstadoService {
  constructor(
    @Inject('CREACION_HISTORIAL_STRATEGIES')
    private readonly strategies: ICreacionHistorialStrategy[],

    @Inject('IHistorialEstadoRepository')
    private readonly historialEstadoRepository: IHistorialEstadoRepository,
  ) {}

  async create(
    crearHistorialEstadoDto: CrearHistorialEstadoDto,
  ): Promise<HistorialEstadoDocumentType> {
    const estrategia = this.strategies.find(
      (s) => s.tipo === crearHistorialEstadoDto.tipo,
    );
    if (!estrategia) {
      throw new Error(
        `No hay strategy para el tipo: ${crearHistorialEstadoDto.tipo}`,
      );
    }
    const historial = await estrategia.crearHistorial(crearHistorialEstadoDto);
    return await this.historialEstadoRepository.create(historial);
  }

  async cerrarHistorial(id: string): Promise<void> {
    const historial = await this.historialEstadoRepository.findOne(id);
    return await this.historialEstadoRepository.cerrarHistorial(historial);
  }

  findAll() {
    return `This action returns all historialEstado`;
  }

  async findOne(id: string): Promise<HistorialEstadoDocumentType> {
    return await this.historialEstadoRepository.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} historialEstado`;
  }
}
