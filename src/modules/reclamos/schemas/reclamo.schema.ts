import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { HistorialAsignacion } from 'src/modules/historial-asignacion/schemas/historial-asignacion.schema';

export type ReclamoDocument = Reclamo & Document;

@Schema({ collection: 'reclamos', timestamps: true })
export class Reclamo {
  @Prop({ required: true })
  nroTicket: string;

  @Prop({ type: Types.ObjectId, ref: 'TipoReclamo', required: true })
  tipoReclamo: Types.ObjectId; //cambiar a TipoReclamo cuando exista el schema de TipoReclamo

  @Prop({ type: Types.ObjectId, ref: 'Prioridad', required: true })
  prioridad: Types.ObjectId; //cambiar a Prioridad cuando exista el schema de Prioridad

  @Prop({ type: Types.ObjectId, ref: 'NivelCriticidad', required: true })
  nivelCriticidad: Types.ObjectId; //cambiar a NivelCriticidad cuando exista el schema de NivelCriticidad

  @Prop({ type: [{ type: Types.ObjectId, ref: 'HistorialAsignacion' }] })
  historialAsignacion?: HistorialAsignacion[];

  @Prop()
  proyecto?: number; //cambiar a Proyecto cuando exista el schema de Proyecto

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
