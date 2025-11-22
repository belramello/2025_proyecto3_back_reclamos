import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Permiso } from 'src/modules/permisos/schemas/permiso.schema';

export type RolDocument = Rol & Document;

@Schema({ collection: 'roles' })
export class Rol {
  _id: Types.ObjectId;

  @Prop({ required: true })
  nombre: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permiso' }] })
  permisos: Permiso[];
}

export const RolSchema = SchemaFactory.createForClass(Rol);
