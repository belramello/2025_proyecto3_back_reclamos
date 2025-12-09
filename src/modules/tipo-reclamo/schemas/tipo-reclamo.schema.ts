import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'tipo_reclamo', timestamps: true })
export class TipoReclamo {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Reclamo' }] })
  reclamos: Types.ObjectId[];
}

export const TipoReclamoSchema = SchemaFactory.createForClass(TipoReclamo);
