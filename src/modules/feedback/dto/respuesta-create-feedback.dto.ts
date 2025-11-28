import { Usuario } from 'src/modules/usuario/schema/usuario.schema';
import { Reclamo } from '../../../modules/reclamos/schemas/reclamo.schema';

export class RespuestaCreateFeedbackDto {
  valoracion: number;
  comentario?: string;
  reclamo: Reclamo;
  cliente: Usuario;
  fechaCreacion: Date;
}
