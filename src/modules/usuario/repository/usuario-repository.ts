import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUsuarioRepository } from './usuario-repository.interface';
import { UsuarioDocument } from '../schema/usuario.schema';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UsersMapper } from '../mappers/usuario.mapper';
import { Usuario } from '../entity/usuario.entity';

@Injectable()
export class UsuarioMongoRepository implements IUsuarioRepository {
  constructor(
    @InjectModel('Usuario') private userModel: Model<UsuarioDocument>,
    private readonly mapper: UsersMapper,
  ) {}

  async create(userData: CreateUsuarioDto): Promise<Usuario> {
    try {
      const userDoc = new this.userModel({ ...userData });
      const saved = await userDoc.save();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.mapper.toEntity(saved);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // IDEA GEMINI --> Considera usar un logger en lugar de lanzar directamente InternalServerErrorException para el error original
      throw new InternalServerErrorException(`Error al crear el usuario.`);
    }
  }

  async findAll(): Promise<Usuario[]> {
    try {
      const docs = await this.userModel.find().exec();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return docs.map((doc) => this.mapper.toEntity(doc));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar todos los usuarios.`,
      );
    }
  }

  async findOne(id: string): Promise<Usuario | null> {
    try {
      const doc = await this.userModel.findById(id).exec();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return doc ? this.mapper.toEntity(doc) : null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar el usuario con ID ${id}.`,
      );
    }
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    try {
      const doc = await this.userModel.findOne({ email }).exec();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return doc ? this.mapper.toEntity(doc) : null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar el usuario con email ${email}.`,
      );
    }
  }

  async update(id: string, updateData: Partial<Usuario>): Promise<Usuario> {
    try {
      const updatedDoc = await this.userModel
        .findOneAndUpdate(
          { _id: id },
          updateData,
          { new: true }, // Opción para devolver el documento actualizado
        )
        .exec();

      if (!updatedDoc) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.mapper.toEntity(updatedDoc);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar el usuario con ID ${id}.`,
      );
    }
  }
}
