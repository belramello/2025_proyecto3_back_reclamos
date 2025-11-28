import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Area } from 'src/modules/areas/schemas/area.schema';

export type SubareaDocumentType = Subarea & Document;

@Schema({ collection: 'subareas' })
export class Subarea {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: Types.ObjectId, ref: 'Area', required: true })
  area: Area;
}

export const SubareaSchema = SchemaFactory.createForClass(Subarea);
