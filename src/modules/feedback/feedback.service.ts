import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import type { IFeedbackRepository } from './repository/feedback-repository.interface';
import { PaginationFeedbackDto } from './dto/pagination-feedback.dto';
import { RespuestaFindAllPaginatedFeedbackDTO } from './dto/respuesta-find-all-paginated-dto';
import { FeedbackValidator } from './helpers/feedback-validator';
import { FeedbackMapper } from './mappers/feedback-mapper';
import { UsuarioDocumentType } from '../usuario/schema/usuario.schema';
import { RespuestaCreateFeedbackDto } from './dto/respuesta-create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @Inject('IFeedbackRepository')
    private readonly feedbackRepository: IFeedbackRepository,
    @Inject(forwardRef(() => FeedbackValidator))
    private readonly feedbackValidator: FeedbackValidator,
    private readonly feedbackmapper: FeedbackMapper,
  ) {}

  async create(
    createFeedbackDto: CreateFeedbackDto,
    usuario: UsuarioDocumentType,
  ): Promise<RespuestaCreateFeedbackDto> {
    const reclamo = await this.feedbackValidator.validateCreateFeedback(
      createFeedbackDto.reclamo,
      String(usuario._id),
    );
    return this.feedbackmapper.toRespuestaCreateFeedback(
      await this.feedbackRepository.createFeedback(
        createFeedbackDto,
        reclamo,
        usuario,
      ),
    );
  }

  async findAll(
    paginationDto: PaginationFeedbackDto,
  ): Promise<RespuestaFindAllPaginatedFeedbackDTO> {
    const { limit = 10, page = 1 } = paginationDto;
    return this.feedbackmapper.toRespuestaFindAllPaginatedFeedbackDto(
      await this.feedbackRepository.findAllPaginated(page, limit),
    );
  }
}
