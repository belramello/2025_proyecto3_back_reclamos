import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITipoReclamosRepository } from './tiporeclamo-repository.interface';
import {
  TipoReclamo,
  TipoReclamoDocumentType,
} from '../schemas/tipo-reclamo.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TipoReclamosRepository implements ITipoReclamosRepository {
  constructor(
    @InjectModel(TipoReclamo.name)
    private readonly tipoReclamoModel: Model<TipoReclamoDocumentType>,
  ) {}

  async findOneByNombre(nombre: string): Promise<TipoReclamoDocumentType> {
    try {
      const doc = await this.tipoReclamoModel.findOne({ nombre }).exec();
      if (!doc) {
        throw new Error(`tipo de reclamo no encontrado: ${nombre}`);
      }
      return doc;
    } catch (error) {
      throw new Error(`Error al buscar eltipo de reclamo: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<TipoReclamoDocumentType | null> {
    const doc = await this.tipoReclamoModel
      .findById(id)
      .populate('area')
      .exec();
    return doc;
  }
  async findAll(): Promise<TipoReclamoDocumentType[]> {
    return this.tipoReclamoModel.find().exec();
  }
}
