import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type EstadoDocument = Estado & Document;

@Schema()
export class Estado {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permiso' }] })
  permisos: string[];
}

export const EstadoSchema = SchemaFactory.createForClass(Estado);
