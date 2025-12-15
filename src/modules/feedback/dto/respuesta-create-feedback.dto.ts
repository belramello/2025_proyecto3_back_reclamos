import { Types } from 'mongoose';
export class RespuestaCreateFeedbackDto {
  valoracion: number;
  comentario?: string;
  reclamo: Types.ObjectId;
  cliente: Types.ObjectId;
  fechaCreacion: Date;
}
