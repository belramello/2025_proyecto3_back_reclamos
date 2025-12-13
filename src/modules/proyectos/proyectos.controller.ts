import { Controller, Get, Post, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import type { RequestWithUsuario } from 'src/middlewares/auth.middleware';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createProyectoDto: CreateProyectoDto,
    @Req() req: RequestWithUsuario
  ) {
    return this.proyectosService.create(createProyectoDto, req.usuario);
  }

  // --- MODIFICADO PARA PAGINACIÓN ---
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
  ) {
    return this.proyectosService.findAll(paginationDto);
  }

  @Get('cliente/:clienteId')
  findByCliente(@Param('clienteId') clienteId: string) {
    return this.proyectosService.findAllByCliente(clienteId);
  }
}