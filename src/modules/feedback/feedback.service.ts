import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import type { IFeedbackRepository } from './repository/feedback-repository.interface';
import { PaginationFeedbackDto } from './dto/pagination-feedback.dto';
import { RespuestaFindAllPaginatedFeedbackDTO } from './dto/respuesta-find-all-paginated-dto';
import { FeedbackValidator } from './helpers/feedback-validator';
import { FeedbackMapper } from './mappers/feedback-mapper';
import { UsuarioDocumentType } from '../usuario/schema/usuario.schema';
import { ReclamosValidator } from '../reclamos/helpers/reclamos-validator';
import { ReclamosService } from '../reclamos/reclamos.service';

@Injectable()
export class FeedbackService {
  constructor(
    @Inject('IFeedbackRepository')
    private readonly feedbackRepository: IFeedbackRepository,
    @Inject(forwardRef(() => FeedbackValidator))
    private readonly feedbackValidator: FeedbackValidator,
    private readonly feedbackmapper: FeedbackMapper,
    private readonly reclamoService: ReclamosService,
  ) {}
  async create(
    createFeedbackDto: CreateFeedbackDto,
    usuario: UsuarioDocumentType,
  ) {
    await this.feedbackValidator.validateCreateFeedback(
      createFeedbackDto.reclamo,
      String(usuario._id),
    );
    const reclamo = await this.reclamoService.findOne(
      createFeedbackDto.reclamo,
    );
    if (!reclamo) {
      throw new Error('Reclamo no encontrado');
    }
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
