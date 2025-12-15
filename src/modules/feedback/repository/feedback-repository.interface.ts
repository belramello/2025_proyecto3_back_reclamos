import { UsuarioDocumentType } from 'src/modules/usuario/schema/usuario.schema';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { Feedback, FeedbackDocument } from '../schemas/feedback.schema';
import { ReclamoDocumentType } from 'src/modules/reclamos/schemas/reclamo.schema';

export interface IFeedbackRepository {
  findByReclamoYCliente(
    reclamoId: string,
    clienteId: string,
  ): Promise<FeedbackDocument | null>;
  createFeedback(
    data: CreateFeedbackDto,
    reclamo: ReclamoDocumentType,
    usuario: UsuarioDocumentType,
  ): Promise<FeedbackDocument>;
  findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{
    feedback: Feedback[];
    total: number;
    page: number;
    lastPage: number;
  }>;
}
