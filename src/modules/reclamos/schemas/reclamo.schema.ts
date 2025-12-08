import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { HistorialAsignacion } from '../../../modules/historial-asignacion/schemas/historial-asignacion.schema';
import { HistorialEstado } from '../../../modules/historial-estado/schema/historial-estado.schema';
import { Proyecto } from '../../proyectos/schemas/proyecto.schema';

export type ReclamoDocumentType = Reclamo & Document;

@Schema({ collection: 'reclamos', timestamps: true })
export class Reclamo {
  @Prop({ required: true })
  nroTicket: string;

  @Prop({ required: true })
  titulo: string;

  //IMPORTANTE: LO PUSE OPCIONAL Y REQUIRED FALSE PARA PODER CREAR EL SEED. DESP ACTUALIZAR SI O SI.
  @Prop({ type: Types.ObjectId, ref: 'TipoReclamo', required: false })
  tipoReclamo?: Types.ObjectId; //cambiar a TipoReclamo cuando exista el schema de TipoReclamo

  //IMPORTANTE: LO PUSE OPCIONAL Y REQUIRED FALSE PARA PODER CREAR EL SEED. DESP ACTUALIZAR SI O SI.
  @Prop({ type: Types.ObjectId, ref: 'Prioridad', required: false })
  prioridad?: string;

  @Prop({ required: true })
  nivelCriticidad?: number;

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

  @Prop({ type: Types.ObjectId, ref: 'Proyecto' })
  proyecto?: Proyecto | Types.ObjectId;

  @Prop()
  descripcion?: string;

  @Prop()
  imagenUrl?: string;

  @Prop()
  resumenResolucion?: string;

  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @Prop({ default: null })
  fechaEliminacion?: Date;
}

export const ReclamoSchema = SchemaFactory.createForClass(Reclamo);
