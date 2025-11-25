import { Inject, Injectable } from '@nestjs/common';
import { IAsignacionStrategy } from './asignacion-strategies/asignacion-strategy.interface';
import { CrearAsignacionDto } from './dto/create-asignacion.dto';
import type { IHistorialAsignacionRepository } from './repositories/historial-asignacion-interface.repository';
import { HistorialAsignacionDocumentType } from './schemas/historial-asignacion.schema';

@Injectable()
export class HistorialAsignacionService {
  constructor(
    @Inject('ASIGNACION_STRATEGIES')
    private readonly strategies: IAsignacionStrategy[],

    @Inject('IHistorialAsignacionRepository')
    private readonly historialAsignacionRepository: IHistorialAsignacionRepository,
  ) {}

  async create(
    crearAsignacionDto: CrearAsignacionDto,
  ): Promise<HistorialAsignacionDocumentType> {
    const estrategia = this.strategies.find(
      (s) => s.tipo === crearAsignacionDto.tipoAsignacion,
    );
    if (!estrategia) {
      throw new Error(
        `No hay strategy para el tipo: ${crearAsignacionDto.tipoAsignacion}`,
      );
    }
    const historial = estrategia.crearHistorial(crearAsignacionDto);
    const historialDoc =
      await this.historialAsignacionRepository.create(historial);
    await this.historialAsignacionRepository.cerrarHistorial(
      crearAsignacionDto.historialACerrarId,
    );
    return historialDoc;
  }

  findAll() {
    return `This action returns all historialAsignacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historialAsignacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} historialAsignacion`;
  }
}
