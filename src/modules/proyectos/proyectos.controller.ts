import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import type { RequestWithUsuario } from 'src/middlewares/auth.middleware';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PermisoRequerido } from 'src/common/decorators/permiso-requerido.decorator';
import { PermisosEnum } from '../permisos/enums/permisos-enum';
import { PermisosGuard } from 'src/common/guards/permisos.guard';
import { Proyecto } from './schemas/proyecto.schema';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe'; // Necesario para validar el ID

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @UseGuards(AuthGuard, PermisosGuard)
  @Post()
  @PermisoRequerido(PermisosEnum.CREAR_PROYECTOS)
  create(
    @Body() createProyectoDto: CreateProyectoDto,
    @Req() req: RequestWithUsuario,
  ) {
    return this.proyectosService.create(createProyectoDto, req.usuario);
  }

  @UseGuards(AuthGuard, PermisosGuard)
  @Get()
  @PermisoRequerido(PermisosEnum.CREAR_PROYECTOS)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.proyectosService.findAll(paginationDto);
  }

  @UseGuards(AuthGuard, PermisosGuard)
  @Get('cliente/:clienteId')
  @PermisoRequerido(PermisosEnum.VER_RECLAMO)
  findByCliente(@Param('clienteId') clienteId: string): Promise<Proyecto[]> {
    return this.proyectosService.findAllByCliente(clienteId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseMongoIdPipe) id: string): Promise<void> {
    await this.proyectosService.remove(id);
  }
}
