import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Rol } from 'src/modules/roles/schema/rol.schema';

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
  nombre?: string;

  @Prop()
  direccion?: string;

  @Prop()
  telefono?: string;

  @Prop()
  subarea?: string; //CAMBIAR

  @Prop()
  area?: string; //CAMBIAR

  //@Prop()
  //passwordResetToken?: string;

  //@Prop()
  //passwordResetExpiration?: Date;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
