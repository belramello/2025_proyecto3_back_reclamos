import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Permiso } from '../../../modules/permisos/schemas/permiso.schema';

export type RolDocumentType = Rol & Document;

@Schema({ collection: 'roles' })
export class Rol {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permiso' }] })
  permisos: Permiso[];
}

export const RolSchema = SchemaFactory.createForClass(Rol);
