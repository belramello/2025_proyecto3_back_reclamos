import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proyecto, ProyectoDocument } from '../schemas/proyecto.schema';
import { CreateProyectoDto } from '../dto/create-proyecto.dto';
import { ProyectosRepositoryInterface } from './proyectos-repository.interface';

@Injectable()
export class ProyectosRepository implements ProyectosRepositoryInterface {
  constructor(
    @InjectModel(Proyecto.name)
    private readonly proyectoModel: Model<ProyectoDocument>,
  ) {}

  async create(createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
    const createdProyecto = new this.proyectoModel(createProyectoDto);
    return await createdProyecto.save();
  }

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

  async findAll(): Promise<Proyecto[]> {
    return await this.proyectoModel.find().populate('cliente').exec();
  }

  async findByCliente(clienteId: string): Promise<Proyecto[]> {
    return await this.proyectoModel.find({ cliente: clienteId }).exec();
  }
}
