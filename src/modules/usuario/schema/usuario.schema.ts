import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocumentType = UserDocument & Document;

@Schema({ collection: 'usuarios' })
export class UserDocument {
  @Prop({ required: true })
  nombreUsuario: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  contraseña: string;

  @Prop({ required: true })
  rol: string; //CAMBIAR A ROL CUANDO ESTÉ EL ROL

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

export const UsuarioSchema = SchemaFactory.createForClass(UserDocument);
