import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EstadoDocument = Estado & Document;

@Schema()
export class Estado {
  @Prop({ required: true })
  nombre: string;
}

export const EstadoSchema = SchemaFactory.createForClass(Estado);
