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
import { PaginationDto } from 'src/common/dto/pagination.dto';

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

  async findAll(paginationDto: PaginationDto): Promise<any> {
    try {
      const { limit = 5, page = 1, rol, busqueda } = paginationDto;
      const skip = (page - 1) * limit;

      const filters: any = {};

      if (rol) {
        filters.rol = new Types.ObjectId(rol);
      }

      if (busqueda) {
        filters.$or = [
          { nombre: { $regex: busqueda, $options: 'i' } },
          { email: { $regex: busqueda, $options: 'i' } },
        ];
      }

      const queryData = this.userModel
        .find(filters)
        .populate({
          path: 'subarea',
          populate: {
            path: 'area',
          },
        })
        .populate('rol')
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      const queryCount = this.userModel.countDocuments(filters);

      const [data, total] = await Promise.all([
        queryData.exec(),
        queryCount.exec(),
      ]);

      return { data, total };
    } catch (error) {
      console.error('Error en findAll repositorio:', error);
      throw new InternalServerErrorException(
        `Error al buscar usuarios paginados: ${error.message}`,
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
        .populate('subarea')
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
        .populate('rol.permisos')
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

  async findByToken(token: string): Promise<UsuarioDocumentType | null> {
    try {
      return await this.userModel.findOne({ tokenActivacion: token }).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar usuario por token: ${error.message}`,
      );
    }
  }

  async countByAreaAndRole(areaId: string, roleId: string): Promise<number> {
    try {
      const areaObjectId = new Types.ObjectId(areaId);
      const roleObjectId = new Types.ObjectId(roleId);

      const query = {
        $and: [
          {
            $or: [
              { area: areaId },
              { area: areaObjectId },
              { 'area._id': areaObjectId },
            ],
          },
          {
            $or: [{ rol: roleObjectId }, { 'rol._id': roleObjectId }],
          },
        ],
      };
      const count = await this.userModel.countDocuments(query);
      return count;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al contar encargados del área ${areaId}: ${error.message}`,
      );
    }
  }

  async findByIdSimple(id: string): Promise<UsuarioDocumentType | null> {
    try {
      return await this.userModel.findById(id).populate('area').exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar usuario por ID simple: ${error.message}`,
      );
    }
  }

  async guardarTokenReset(
    email: string,
    token: string,
    expiration: Date,
  ): Promise<void> {
    try {
      await this.userModel.updateOne(
        { email },
        { passwordResetToken: token, passwordResetExpiration: expiration },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al guardar token de reset para email ${email}: ${error.message}`,
      );
    }
  }

  async findOneByResetToken(
    token: string,
  ): Promise<UsuarioDocumentType | null> {
    try {
      const doc = await this.userModel
        .findOne({
          passwordResetToken: token,
          passwordResetExpiration: { $gt: new Date() },
        })
        .exec();
      return doc ?? null;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar usuario con token ${token}: ${error.message}`,
      );
    }
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    try {
      const result = await this.userModel
        .updateOne(
          { _id: id },
          {
            contraseña: newPassword,
            passwordResetToken: null,
            passwordResetExpiration: null,
          },
        )
        .exec();
      if (result.matchedCount === 0) {
        throw new NotFoundException(
          `Usuario con ID ${id} no encontrado para actualizar contraseña.`,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar la contraseña del usuario con ID ${id}: ${error.message}`,
      );
    }
  }
}
