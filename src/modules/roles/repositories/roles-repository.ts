import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRolesRepository } from './roles-repository.interface';
import { Rol, RolDocument } from '../schema/rol.schema';

export class RolesRepository implements IRolesRepository {
  constructor(
    @InjectModel(Rol.name)
    private readonly rolModel: Model<RolDocument>,
  ) {}

  async findAll(): Promise<Rol[]> {
    try {
      return await this.rolModel.find().populate('permisos').exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener roles: ${error.message}`,
      );
    }
  }

  async findOne(rolId: string): Promise<Rol | null> {
    try {
      const rol = await this.rolModel
        .findById(rolId)
        .populate('permisos')
        .exec();
      if (!rol) {
        throw new NotFoundException(`No existe rol con ID ${rolId}`);
      }
      return rol;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Error al obtener el rol con ID ${rolId}: ${error.message}`,
      );
    }
  }
}
