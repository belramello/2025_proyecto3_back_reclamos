import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Area } from 'src/modules/areas/schemas/area.schema';
import { Reclamo } from 'src/modules/reclamos/schemas/reclamo.schema';
import { Subarea } from 'src/modules/subareas/schemas/subarea.schema';
import { Usuario } from 'src/modules/usuario/schema/usuario.schema';

export type HistorialAsignacionDocumentType = HistorialAsignacion & Document;

@Schema({ collection: 'historial_asignaciones' })
export class HistorialAsignacion {
  @Prop({ type: Types.ObjectId, ref: 'Reclamo', required: true })
  reclamo: Reclamo;

  @Prop({ type: Types.ObjectId, ref: 'Area', required: false, default: null })
  desdeArea: Area;

  @Prop({ type: Types.ObjectId, ref: 'Area', required: false, default: null })
  haciaArea: Area;

  @Prop({
    type: Types.ObjectId,
    ref: 'Subarea',
    required: false,
    default: null,
  })
  desdeSubarea: Subarea;

  @Prop({
    type: Types.ObjectId,
    ref: 'Subarea',
    required: false,
    default: null,
  })
  haciaSubarea: Subarea;

  @Prop({
    type: Types.ObjectId,
    ref: 'Usuario',
    required: false,
    default: null,
  })
  deEmpleado: Usuario;

  @Prop({
    type: Types.ObjectId,
    ref: 'Usuario',
    required: false,
    default: null,
  })
  haciaEmpleado: Usuario;

  @Prop({ default: Date.now })
  fechaAsignacion: Date;

  @Prop({ required: true })
  tipoAsignacion: string;

  @Prop({ required: false, default: null })
  comentario: string;
}

export const HistorialAsignacionSchema =
  SchemaFactory.createForClass(HistorialAsignacion);
