import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUsuarioRepository } from './usuario-repository.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UsersMapper } from '../mappers/usuario.mapper';
import { IUsuarioAuth } from '../../auth/interface/usuario-auth.interface';
import { Usuario } from '../schema/usuario.schema';

@Injectable()
export class UsuarioMongoRepository implements IUsuarioRepository {
  constructor(
    @InjectModel('Usuario') private userModel: Model<Usuario>,
    private readonly mapper: UsersMapper,
  ) {}

  async create(userData: CreateUsuarioDto): Promise<Usuario> {
    try {
      const userDoc = new this.userModel({ ...userData });
      const saved = await userDoc.save();
      return saved;
    } catch (error) {
      // IDEA GEMINI --> Considera usar un logger en lugar de lanzar directamente InternalServerErrorException para el error original
      throw new InternalServerErrorException(`Error al crear el usuario.`);
    }
  }

  async findAll(): Promise<Usuario[]> {
    try {
      const docs = await this.userModel.find().exec();
      return docs;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar todos los usuarios.`,
      );
    }
  }

  async findOne(id: string): Promise<Usuario | null> {
    try {
      const doc = await this.userModel.findById(id).exec();
      if (!doc) {
        return null;
      }
      return doc;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar el usuario con ID ${id}.`,
      );
    }
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    try {
      const doc = await this.userModel.findOne({ email }).exec();
      if (!doc) {
        return null;
      }
      return doc;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar el usuario con email ${email}.`,
      );
    }
  }

  async update(id: string, updateData: Partial<Usuario>): Promise<Usuario> {
    try {
      const updatedDoc = await this.userModel
        .findOneAndUpdate({ _id: id }, updateData, { new: true })
        .exec();
      if (!updatedDoc) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
      }
      return updatedDoc;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar el usuario con ID ${id}.`,
      );
    }
  }
  async remove(id: string): Promise<void> {
    try {
      const result = await this.userModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(
          `Usuario con ID ${id} no encontrado para eliminar.`,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar el usuario con ID ${id}.`,
      );
    }
  }

  async findByEmailForAuth(email: string): Promise<IUsuarioAuth | null> {
    const doc = await this.userModel.findOne({ email }).exec();
    if (!doc) {
      return null;
    }
    return {
      id: doc._id.toString(),
      email: doc.email,
      contraseña: doc.contraseña,
      nombre: doc.nombre,
    } as IUsuarioAuth;
  }
}
