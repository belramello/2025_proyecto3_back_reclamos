import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type PermisoDocument = Permiso & Document;

@Schema()
export class Permiso {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rol' }] })
  roles: string[];
}

export const PermisoSchema = SchemaFactory.createForClass(Permiso);
