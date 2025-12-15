import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import type { RequestWithUsuario } from 'src/middlewares/auth.middleware';
import { PermisosGuard } from 'src/common/guards/permisos.guard';
import { PermisosEnum } from '../permisos/enums/permisos-enum';
import { PermisoRequerido } from 'src/common/decorators/permiso-requerido.decorator';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UseGuards(AuthGuard, PermisosGuard)
  @PermisoRequerido(PermisosEnum.CREAR_FEEDBACK)
  @Post()
  async create(
    @Body() createReclamoDto: CreateFeedbackDto,
    @Req() req: RequestWithUsuario,
  ) {
    console.log('Usuario que crea el feedback:', req.usuario);
    console.log('Datos del feedback a crear:', createReclamoDto);
    return await this.feedbackService.create(createReclamoDto, req.usuario);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.feedbackService.findAll(paginationDto);
  }
}
