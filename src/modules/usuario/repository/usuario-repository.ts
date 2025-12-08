import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUsuarioRepository } from './usuario-repository.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { Usuario, UsuarioDocumentType } from '../schema/usuario.schema';
import { RolDocumentType } from 'src/modules/roles/schema/rol.schema';

@Injectable()
export class UsuarioMongoRepository implements IUsuarioRepository {
  constructor(
    @InjectModel(Usuario.name)
    private readonly userModel: Model<UsuarioDocumentType>,
  ) {}

  async create(
    userData: CreateUsuarioDto,
    rol: RolDocumentType,
  ): Promise<UsuarioDocumentType> {
    try {
      const userDoc = new this.userModel({
        ...userData,
        rol: rol,
      });
      const created = await userDoc.save();
      // Buscamos de nuevo para devolverlo populado si fuera necesario, 
      // o simplemente devolvemos 'created' si no requieres popular nada extra inmediatamente.
      // Mantengo tu lógica de buscarlo:
      const user = await this.findOne(created._id.toString());
      if (!user) {
        throw new InternalServerErrorException(`Error al crear el usuario`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear el usuario: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<UsuarioDocumentType[]> {
    try {
      const docs = await this.userModel.find().exec();
      return docs;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar todos los usuarios.`,
      );
    }
  }

  async findOne(id: string): Promise<UsuarioDocumentType | null> {
    try {
      const doc = await this.userModel
        .findById(id)
        .populate('rol')
        .populate('area')
        .populate({
          path: 'subarea',
          populate: {
            path: 'area',
          },
        })
        .exec();

      return doc ?? null;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar el usuario con ID ${id}.`,
      );
    }
  }

  async findByEmail(email: string): Promise<UsuarioDocumentType | null> {
    try {
      const doc = await this.userModel
        .findOne({ email })
        .populate('rol')
        .populate('rol.permisos') // Asegúrate que 'permisos' sea el campo correcto en tu schema de Rol
        .exec();
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

  async update(
    id: string,
    updateData: Partial<UsuarioDocumentType>,
  ): Promise<UsuarioDocumentType> {
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

  // --- CORRECCIÓN AQUÍ ---
  async findByToken(token: string): Promise<UsuarioDocumentType | null> {
    try {
      // Corregido: 'this.usuarioModel' no existía, debe ser 'this.userModel'
      return await this.userModel.findOne({ tokenActivacion: token }).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar usuario por token: ${error.message}`,
      );
    }
  }
}