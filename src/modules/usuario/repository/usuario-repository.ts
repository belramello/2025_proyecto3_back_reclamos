import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUsuarioRepository } from './usuario-repository.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { Usuario, UsuarioDocumentType } from '../schema/usuario.schema';
import { RolDocumentType } from 'src/modules/roles/schema/rol.schema';
import { SubareasService } from 'src/modules/subareas/subareas.service';

@Injectable()
export class UsuarioMongoRepository implements IUsuarioRepository {
  constructor(
    @InjectModel(Usuario.name)
    private readonly userModel: Model<UsuarioDocumentType>,
    private readonly subareaService: SubareasService,
  ) {}

  async create(
    userData: CreateUsuarioDto,
    rol: RolDocumentType,
  ): Promise<UsuarioDocumentType> {
    try {
      const userDoc = new this.userModel({
        ...userData,
        rol: rol,
        subarea: userData.subarea ? new Types.ObjectId(userData.subarea) : null,
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

  async findAllEmpleadosBySubareaId(
    subareaId: string,
  ): Promise<UsuarioDocumentType[]> {
    try {
      const subareaObjectId = new Types.ObjectId(subareaId);
      const docs = await this.userModel
        .find({ subarea: subareaObjectId })
        .exec();
      return docs;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar todos los usuarios pertenecientes a la subarea ${subareaId}.`,
      );
    }
  }

  async findAllEmpleadosDeSubarea(
    nombreSubarea: string,
  ): Promise<UsuarioDocumentType[]> {
    try {
      const subarea = await this.subareaService.findOneByNombre(nombreSubarea);
      if (!subarea) {
        throw new NotFoundException(
          `Subarea con nombre ${nombreSubarea} no encontrada.`,
        );
      }
      return await this.findAllEmpleadosBySubareaId(String(subarea._id));
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener empleados de la subarea ${nombreSubarea}: ${error.message}`,
      );
    }
  }

  async findAllEmpleadosDeArea(
    nombreArea: string,
  ): Promise<UsuarioDocumentType[]> {
    try {
      const subareas =
        await this.subareaService.findAllSubareasDeArea(nombreArea);
      let empleados: UsuarioDocumentType[] = [];
      for (const subarea of subareas) {
        empleados.push(
          ...(await this.findAllEmpleadosBySubareaId(String(subarea._id))),
        );
      }
      return empleados;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener empleados de la subarea ${nombreArea}: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<UsuarioDocumentType | null> {
    try {
      const doc = await this.userModel
        .findById(id)
        .populate({
          path: 'rol',
          populate: {
            path: 'permisos',
          },
        })
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
