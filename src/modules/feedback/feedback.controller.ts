import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import type { RequestWithUsuario } from 'src/middlewares/auth.middleware';
import { PermisosGuard } from 'src/common/guards/permisos.guard';
import { PermisosEnum } from '../permisos/enums/permisos-enum';
import { PermisoRequerido } from 'src/common/decorators/permiso-requerido.decorator';
import { RespuestaFindAllPaginatedFeedbackDTO } from './dto/respuesta-find-all-paginated-dto';
import { RespuestaCreateFeedbackDto } from './dto/respuesta-create-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UseGuards(AuthGuard, PermisosGuard)
  @PermisoRequerido(PermisosEnum.CREAR_FEEDBACK)
  @Post()
  async create(
    @Body() createReclamoDto: CreateFeedbackDto,
    @Req() req: RequestWithUsuario,
  ): Promise<RespuestaCreateFeedbackDto> {
    return await this.feedbackService.create(createReclamoDto, req.usuario);
  }

  //VER SI SE TERMINA USANDO, AGREGAR PERMISOS SI CORRESPONDE.
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<RespuestaFindAllPaginatedFeedbackDTO> {
    return this.feedbackService.findAll(paginationDto);
  }
}
