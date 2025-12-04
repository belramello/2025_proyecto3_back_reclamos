import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { Feedback, FeedbackDocument } from '../schemas/feedback.schema';

export interface IFeedbackRepository {
  findByReclamoYCliente(
    reclamoId: string,
    clienteId: string,
  ): Promise<FeedbackDocument | null>;
  createFeedback(data: CreateFeedbackDto): Promise<FeedbackDocument>;
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
