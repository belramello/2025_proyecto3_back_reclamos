import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { HistorialAsignacion } from '../../../modules/historial-asignacion/schemas/historial-asignacion.schema';
import { HistorialEstado } from '../../../modules/historial-estado/schema/historial-estado.schema';
import { Proyecto } from '../../proyectos/schemas/proyecto.schema';
import { Usuario } from 'src/modules/usuario/schema/usuario.schema';

export type ReclamoDocumentType = Reclamo & Document;
export enum Prioridad {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
}

@Schema({ collection: 'reclamos', timestamps: true })
export class Reclamo {
  @Prop({ required: true })
  nroTicket: string;

  @Prop({ required: true })
  titulo: string;

  // TEMPORAL: requerido en false para poder crear el seed
  @Prop({ type: Types.ObjectId, ref: 'TipoReclamo', required: false })
  tipoReclamo?: Types.ObjectId;

  @Prop({ type: String, enum: Prioridad, required: true })
  prioridad: Prioridad;

  @Prop({ type: Number, required: true, min: 1, max: 10 })
  nivelCriticidad: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'HistorialAsignacion' }] })
  historialAsignaciones: (Types.ObjectId | HistorialAsignacion)[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'HistorialEstado' }] })
  historialEstados: (Types.ObjectId | HistorialEstado)[];

  @Prop({ type: Types.ObjectId, ref: 'HistorialAsignacion' })
  ultimoHistorialAsignacion:
    | Types.ObjectId
    | (HistorialAsignacion & { _id: Types.ObjectId });

  @Prop({ type: Types.ObjectId, ref: 'HistorialEstado' })
  ultimoHistorialEstado:
    | Types.ObjectId
    | (HistorialEstado & { _id: Types.ObjectId });

  // 👇 CAMBIO IMPORTANTE: requerido TRUE según historia de usuario
  @Prop({ type: Types.ObjectId, ref: 'Proyecto', required: true })
  proyecto: Proyecto | Types.ObjectId;

  @Prop({ type: [String], required: false })
  imagenUrl?: string[];

  @Prop()
  resumenResolucion?: string;

  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @Prop({ default: null })
  fechaEliminacion?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario: Usuario | Types.ObjectId;
}

export const ReclamoSchema = SchemaFactory.createForClass(Reclamo);
