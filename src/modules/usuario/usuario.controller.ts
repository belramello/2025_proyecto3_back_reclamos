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
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RespuestaUsuarioDto } from './dto/respuesta-usuario.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { RolesEnum } from '../roles/enums/roles-enum';

import { AuthGuard } from 'src/middlewares/auth.middleware';
import type { RequestWithUsuario } from 'src/middlewares/auth.middleware';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // =================================================================
  // 1. RUTAS ESTÁTICAS / ESPECÍFICAS (VAN PRIMERO)
  // =================================================================

  @Post('gestion-empleados')
  async createEmpleado(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    const dtoEmpleado = { ...createUsuarioDto, rol: RolesEnum.EMPLEADO };
    return this.usuarioService.create(dtoEmpleado);
  }

  // --- REGISTRO DE CLIENTES ---
  @Post('registrar-cliente')
  async createCliente(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    const dtoCliente = { ...createUsuarioDto, rol: RolesEnum.CLIENTE };
    return this.usuarioService.create(dtoCliente);
  }

  // --- LISTADOS ESPECÍFICOS ---
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

  // --- CRUD GENÉRICO (CREATE) ---
  @Post()
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    return this.usuarioService.create(createUsuarioDto);
  }

  // --- LISTAR TODOS ---
  @Get()
  async findAll(): Promise<RespuestaUsuarioDto[]> {
    return this.usuarioService.findAll();
  }

  // =================================================================
  // 2. RUTAS DINÁMICAS / CON PARÁMETROS (VAN AL FINAL)
  // =================================================================

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
