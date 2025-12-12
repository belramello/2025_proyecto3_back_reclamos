import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Query, // Importar Query
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RespuestaUsuarioDto } from './dto/respuesta-usuario.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { RolesEnum } from '../roles/enums/roles-enum';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import type { RequestWithUsuario } from 'src/middlewares/auth.middleware';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('gestion-empleados')
  @UseGuards(AuthGuard)
  async createEmpleado(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Req() req: RequestWithUsuario,
  ): Promise<RespuestaUsuarioDto> {
    const dtoEmpleado = { ...createUsuarioDto, rol: RolesEnum.EMPLEADO };
    return this.usuarioService.create(dtoEmpleado, req.usuario);
  }

  @Post('registrar-cliente')
  @UseGuards(AuthGuard)
  async createCliente(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Req() req: RequestWithUsuario,
  ): Promise<RespuestaUsuarioDto> {
    const dtoCliente = { ...createUsuarioDto, rol: RolesEnum.CLIENTE };
    return this.usuarioService.create(dtoCliente, req.usuario);
  }

  @Get('empleados-subarea')
  @UseGuards(AuthGuard)
  async findAllEmpleadosDeSubarea(@Req() req: RequestWithUsuario) {
    return this.usuarioService.findAllEmpleadosDeSubareaDelUsuario(
      String(req.usuario._id),
    );
  }

  @Get('empleados-area')
  @UseGuards(AuthGuard)
  async findAllEmpleadosDeArea(@Req() req: RequestWithUsuario) {
    return this.usuarioService.findAllEmpleadosDeAreaDelUsuario(
      String(req.usuario._id),
    );
  }

  @Post()
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    return this.usuarioService.create(createUsuarioDto);
  }

  // --- MODIFICADO PARA PAGINACIÓN ---
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<RespuestaUsuarioDto[]> {
    return this.usuarioService.findAll(paginationDto);
  }

  @Patch('gestion-empleados/:id')
  async updateEmpleado(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    return this.usuarioService.updateEmpleado(id, updateUsuarioDto);
  }

  @Delete('gestion-empleados/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeEmpleado(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<void> {
    await this.usuarioService.removeEmpleado(id);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<RespuestaUsuarioDto> {
    return this.usuarioService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseMongoIdPipe) id: string): Promise<void> {
    await this.usuarioService.remove(id);
  }
}