import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Proyecto, ProyectoDocument } from '../schemas/proyecto.schema';
import { CreateProyectoDto } from '../dto/create-proyecto.dto';
import { ProyectosRepositoryInterface } from './proyectos-repository.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProyectosRepository implements ProyectosRepositoryInterface {
  constructor(
    @InjectModel(Proyecto.name)
    private readonly proyectoModel: Model<ProyectoDocument>,
  ) {}

  async create(createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
    const { cliente, ...restoDatos } = createProyectoDto;
    
    const createdProyecto = new this.proyectoModel({
      ...restoDatos,
      cliente: new Types.ObjectId(cliente),
    });
    return await createdProyecto.save();
  }

  // --- ¡MÉTODO FINDALL CORREGIDO PARA PAGINACIÓN! ---
  async findAll(paginationDto: PaginationDto): Promise<{ data: Proyecto[]; total: number }> {
    try {
        const { limit = 5, page = 1, busqueda } = paginationDto;
        const skip = (page - 1) * limit;

        const filters: any = {};

        // Si hay búsqueda, filtramos por título (o descripción si quieres agregarla)
        if (busqueda && busqueda.trim() !== '') {
            filters.$or = [
                { titulo: { $regex: busqueda, $options: 'i' } },
                // { descripcion: { $regex: busqueda, $options: 'i' } } // Descomenta si quieres buscar en descripción también
            ];
        }

        // 1. Consulta de DATOS
        const queryData = this.proyectoModel
            .find(filters)
            .limit(limit)
            .skip(skip)
            .populate('cliente') // Traemos datos del cliente
            .sort({ createdAt: -1 }); // Ordenar por fecha (opcional)

        // 2. Consulta de TOTAL
        const queryCount = this.proyectoModel.countDocuments(filters);

        // Ejecutamos en paralelo
        const [data, total] = await Promise.all([queryData.exec(), queryCount.exec()]);

        return { data, total };

    } catch (error) {
        throw new InternalServerErrorException(
            `Error al buscar proyectos paginados: ${error.message}`
        );
    }
  }
  // --------------------------------------------------

  async findOne(id: string): Promise<ProyectoDocument | null> {
    try {
      const proyecto = await this.proyectoModel
        .findById(id)
        .populate('cliente')
        .exec();
      return proyecto;
    } catch (error) {
      throw new Error(
        `Error al obtener el proyecto con ID ${id}: ${error.message}`,
      );
    }
  }

  async findByCliente(clienteId: string): Promise<Proyecto[]> {
    return await this.proyectoModel.find({ cliente: new Types.ObjectId(clienteId) }).exec();
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.proyectoModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Proyecto con ID ${id} no encontrado para eliminar.`);
      }
    } catch (error) {
      // Asegúrate de que este manejo de errores lanza la excepción correcta
      throw new InternalServerErrorException(
        `Error al eliminar el proyecto con ID ${id}: ${error.message}`,
      );
    }
  }
}