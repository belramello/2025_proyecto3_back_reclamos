import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Reclamo } from 'src/modules/reclamos/schemas/reclamo.schema';
import { Usuario } from 'src/modules/usuario/schema/usuario.schema';

export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ type: Number, required: true, min: 1, max: 5 })
  valoracion: number;

  @Prop({ type: String, required: false, trim: true })
  comentario: string;

  @Prop({ type: Types.ObjectId, ref: Reclamo.name, required: true })
  reclamo: Reclamo | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  cliente: Usuario | Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  fechaCreacion: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
