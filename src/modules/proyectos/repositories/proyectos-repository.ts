import { Injectable } from '@nestjs/common';
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

  // --- MODIFICADO PARA PAGINACIÓN ---
  async findAll(paginationDto: PaginationDto): Promise<Proyecto[]> {
    const { limit = 5, page = 1 } = paginationDto;
    const skip = (page - 1) * limit;

    return await this.proyectoModel
      .find()
      .limit(limit)
      .skip(skip)
      .populate('cliente')
      .exec();
  }

  async findByCliente(clienteId: string): Promise<Proyecto[]> {
    return await this.proyectoModel.find({ cliente: new Types.ObjectId(clienteId) }).exec();
  }
}