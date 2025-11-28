import { IPermisosRepository } from './permisos-repository.interface';
import { Permiso } from '../schemas/permiso.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class PermisosRepository implements IPermisosRepository {
  constructor(
    @InjectModel(Permiso.name)
    private readonly permisoModel: Model<Permiso>,
  ) {}

  async findAll(): Promise<Permiso[]> {
    try {
      return await this.permisoModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al encontrar todos los permisos: ${error.message}`,
      );
    }
  }

  async findAllByRol(rolId: string): Promise<Permiso[]> {
    try {
      const permisos = await this.permisoModel.find({ roles: rolId }).exec();
      if (!permisos || permisos.length === 0) {
        throw new NotFoundException(
          `No se encontraron permisos para el rol con ID ${rolId}`,
        );
      }
      return permisos;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        `Error al encontrar permisos de un rol: ${error.message}`,
      );
    }
  }

  async findOne(permisoId: string): Promise<Permiso | null> {
    try {
      return await this.permisoModel.findById(permisoId).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al encontrar un permiso: ${error.message}`,
      );
    }
  }
}
