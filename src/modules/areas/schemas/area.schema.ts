import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Subarea } from '../../../modules/subareas/schemas/subarea.schema';

export type AreaDocumentType = Area & Document;

@Schema({ collection: 'areas' })
export class Area {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: Types.ObjectId, ref: 'Subarea', required: true, default: null })
  subareas: Subarea[];
}

export const AreaSchema = SchemaFactory.createForClass(Area);
