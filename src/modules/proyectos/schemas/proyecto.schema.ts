import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Usuario } from '../../usuario/schema/usuario.schema';
import { TipoProyecto } from '../enums/TipoProyectoEnum';

export type ProyectoDocument = Proyecto & Document;

@Schema({ collection: 'proyectos', timestamps: true })
export class Proyecto {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop()
  descripcionDetallada: string;

  @Prop({ required: true })
  fechaInicio: Date;

  @Prop({
    required: true,
    enum: Object.values(TipoProyecto),
  })
  tipo: TipoProyecto;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  cliente: Usuario;
}

export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);
