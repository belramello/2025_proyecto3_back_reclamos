import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Subarea, SubareaDocumentType } from '../schemas/subarea.schema';
import { ISubareasRepository } from './subareas-repository.interface';
import { Types } from 'mongoose';

export class SubareasRepository implements ISubareasRepository {
  constructor(
    @InjectModel(Subarea.name)
    private readonly subareaModel: Model<SubareaDocumentType>,
  ) {}

  async findOne(subareaId: string): Promise<SubareaDocumentType | null> {
    try {
      return await this.subareaModel
        .findById(subareaId)
        .populate('area')
        .exec();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Error al obtener el rol con ID ${subareaId}: ${error.message}`,
      );
    }
  }

  async findOneByNombre(nombre: string): Promise<SubareaDocumentType | null> {
    try {
      return await this.subareaModel.findOne({ nombre }).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener el subarea con nombre ${nombre}: ${error.message}`,
      );
    }
  }

  async findAllByAreaId(areaId: string): Promise<SubareaDocumentType[]> {
    try {
      return await this.subareaModel.find({ area: areaId }).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener las subáreas del área con ID ${areaId}: ${error.message}`,
      );
    }
  }

  async findAllSubareasDeArea(
    nombreArea: string,
  ): Promise<SubareaDocumentType[]> {
    try {
      return await this.subareaModel
        .find()
        .populate({
          path: 'area',
          match: { nombre: nombreArea },
        })
        .then((subs) => subs.filter((s) => s.area));
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener las subareas de la area con el nombre ${nombreArea}: ${error.message}`,
      );
    }
  }

  async findAllPorArea(areaId: string): Promise<SubareaDocumentType[]> {
    try {
      return await this.subareaModel
        .find({
          area: new Types.ObjectId(areaId),
        })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener las subáreas del área con ID ${areaId}: ${error.message}`,
      );
    }
  }
}
