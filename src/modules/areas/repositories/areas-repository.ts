import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Area, AreaDocumentType } from '../schemas/area.schema';
import { IAreaRepository } from './areas-repository.interface';

export class AreaRepository implements IAreaRepository {
  constructor(
    @InjectModel(Area.name)
    private readonly areaModel: Model<AreaDocumentType>,
  ) {}

  async findOne(areaId: string): Promise<AreaDocumentType | null> {
    try {
      return await this.areaModel.findById(areaId).exec();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Error al obtener el area con ID ${areaId}: ${error.message}`,
      );
    }
  }
}
