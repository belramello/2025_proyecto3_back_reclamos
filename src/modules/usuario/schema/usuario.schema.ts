import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Area } from '../../../modules/areas/schemas/area.schema';
import { Rol } from '../../../modules/roles/schema/rol.schema';
import { Subarea } from '../../../modules/subareas/schemas/subarea.schema';

export type UsuarioDocumentType = Usuario & Document;

@Schema({ collection: 'usuarios' })
export class Usuario {
  @Prop({ required: true })
  nombreUsuario: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  contraseña: string;

  @Prop({ type: Types.ObjectId, ref: 'Rol', required: true, default: null })
  rol: Rol;

  @Prop()
  nombre: string;

  @Prop()
  direccion?: string;

  @Prop()
  telefono?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Subarea',
    required: false,
    default: null,
  })
  subarea?: Subarea;

  @Prop({ type: Types.ObjectId, ref: 'Area', required: false, default: null })
  area?: Area;

  // --- NUEVOS CAMPOS PARA ACTIVACIÓN DE CUENTA ---
  @Prop({ default: null })
  tokenActivacion: string;

  @Prop({ default: null })
  tokenExpiracion: Date;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);