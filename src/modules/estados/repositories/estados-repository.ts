import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEstadosRepository } from './estados-repository.interface';
import { Estado, EstadoDocumentType } from '../schemas/estado.schema';

export class EstadosRepository implements IEstadosRepository {
  constructor(
    @InjectModel(Estado.name)
    private readonly estadoModel: Model<EstadoDocumentType>,
  ) {}

  async findOneByNombre(nombre: string): Promise<EstadoDocumentType> {
    try {
      const doc = await this.estadoModel.findOne({ nombre }).exec();
      if (!doc) {
        throw new Error(`Estado no encontrado: ${nombre}`);
      }
      return doc;
    } catch (error) {
      throw new Error(`Error al buscar el estado: ${error.message}`);
    }
  }
}
