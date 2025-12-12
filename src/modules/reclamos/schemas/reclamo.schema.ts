import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { HistorialAsignacion } from '../../../modules/historial-asignacion/schemas/historial-asignacion.schema';
import { HistorialEstado } from '../../../modules/historial-estado/schema/historial-estado.schema';
import { Proyecto } from '../../proyectos/schemas/proyecto.schema';
import { Usuario } from 'src/modules/usuario/schema/usuario.schema';
import { Prioridad } from '../dto/respuesta-create-reclamo.dto';

export type ReclamoDocumentType = Reclamo & Document;

@Schema({ collection: 'reclamos', timestamps: true })
export class Reclamo {
  @Prop({ required: true })
  nroTicket: string;

  @Prop({ required: true })
  titulo: string;

  // TEMPORAL: requerido en false para poder crear el seed
  @Prop({ type: Types.ObjectId, ref: 'TipoReclamo', required: false })
  tipoReclamo?: Types.ObjectId;

  //LO PONGO EN REQUIRED: FALSE PARA QUE NO SE ROMPA EL REPOSIOTIO CON EL SEED QUE HICE
  @Prop({
    type: String,
    enum: ['BAJA', 'MEDIA', 'ALTA'],
    required: false,
  })
  prioridad: Prioridad;

  //LO PONGO EN REQUIRED: FALSE PARA QUE NO SE ROMPA EL REPOSIOTIO CON EL SEED QUE HICE
  @Prop({ type: Number, required: false, min: 1, max: 10 })
  nivelCriticidad: number;

  @Prop()
  descripcion?: string;

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

  //LO PONGO EN FALSE PARA QUE NO SE ROMPA EL REPOSIOTIO CON EL SEED QUE HICE
  @Prop({ type: Types.ObjectId, ref: 'Proyecto', required: false })
  proyecto: Proyecto | Types.ObjectId;

  @Prop({ type: [String], required: false })
  imagenUrl?: string[];

  @Prop()
  resumenResolucion?: string;

  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @Prop({ default: null })
  fechaEliminacion?: Date;

  //LO PONGO EN FALSE PARA QUE NO SE ROMPA EL REPOSIOTIO CON EL SEED QUE HICE
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: false })
  usuario: Usuario | Types.ObjectId;
}

export const ReclamoSchema = SchemaFactory.createForClass(Reclamo);
