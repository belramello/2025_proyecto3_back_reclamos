import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Area } from 'src/modules/areas/schemas/area.schema';

export type TipoReclamoDocumentType = TipoReclamo & Document;
@Schema({ collection: 'tipo_reclamo', timestamps: true })
export class TipoReclamo {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Reclamo' }] })
  reclamos: Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true })
  area: Area;
}

export const TipoReclamoSchema = SchemaFactory.createForClass(TipoReclamo);
