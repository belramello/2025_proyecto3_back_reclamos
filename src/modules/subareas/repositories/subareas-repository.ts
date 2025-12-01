import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Subarea, SubareaDocumentType } from '../schemas/subarea.schema';
import { ISubareasRepository } from './subareas-repository.interface';

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
}
