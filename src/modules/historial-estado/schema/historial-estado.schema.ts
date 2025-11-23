import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Estado } from 'src/modules/estados/schemas/estado.schema';
import { Reclamo } from 'src/modules/reclamos/schemas/reclamo.schema';
import { Usuario } from 'src/modules/usuario/schema/usuario.schema';

export type HistorialEstadoDocumentType = HistorialEstado & Document;

@Schema({ collection: 'historial_estado' })
export class HistorialEstado {
  @Prop({ type: Types.ObjectId, ref: 'Reclamo', required: true })
  reclamo: Reclamo;

  @Prop({
    type: Types.ObjectId,
    ref: 'Usuario',
    required: true,
  })
  usuarioResponsable: Usuario;

  @Prop({ default: Date.now })
  fechaHoraInicio: Date;

  @Prop({ default: Date.now })
  fechaHoraFin: Date;

  @Prop({ required: true })
  estado: Estado;
}

export const HistorialEstadoSchema =
  SchemaFactory.createForClass(HistorialEstado);
