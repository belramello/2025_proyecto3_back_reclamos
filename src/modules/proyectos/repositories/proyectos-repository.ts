import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proyecto, ProyectoDocument } from '../schemas/proyecto.schema';
import { CreateProyectoDto } from '../dto/create-proyecto.dto';
import { ProyectosRepositoryInterface } from './proyectos-repository.interface';

@Injectable()
export class ProyectosRepository implements ProyectosRepositoryInterface {
  constructor(
    @InjectModel(Proyecto.name) private readonly proyectoModel: Model<ProyectoDocument>,
  ) {}

  async create(createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
    const createdProyecto = new this.proyectoModel(createProyectoDto);
    return await createdProyecto.save();
  }

  async findAll(): Promise<Proyecto[]> {
    // Populate para traer los datos del cliente (Usuario)
    return await this.proyectoModel.find().populate('cliente').exec();
  }

  async findByCliente(clienteId: string): Promise<Proyecto[]> {
    return await this.proyectoModel.find({ cliente: clienteId }).exec();
  }
}