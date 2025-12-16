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
  Query,
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
import { PermisoRequerido } from 'src/common/decorators/permiso-requerido.decorator';
import { PermisosEnum } from '../permisos/enums/permisos-enum';
import { PermisosGuard } from 'src/common/guards/permisos.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // --- 1. GESTIÓN DE EMPLEADOS (Para el Encargado) ---
  @Post('gestion-empleados')
  @UseGuards(AuthGuard)
  async createEmpleado(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Req() req: RequestWithUsuario,
  ): Promise<RespuestaUsuarioDto> {
    const dtoEmpleado = { ...createUsuarioDto, rol: RolesEnum.EMPLEADO };
    return this.usuarioService.create(dtoEmpleado, req.usuario);
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

  // Listar empleados de la Subárea (si aplica)
  @Get('empleados-subarea')
  @UseGuards(AuthGuard)
  async findAllEmpleadosDeSubarea(@Req() req: RequestWithUsuario) {
    return this.usuarioService.findAllEmpleadosDeSubareaDelUsuario(
      String(req.usuario._id),
    );
  }

  // Listar empleados del Área (Lo que necesitas para tu tabla de empleados)
  @Get('empleados-area')
  @UseGuards(AuthGuard)
  async findAllEmpleadosDeArea(@Req() req: RequestWithUsuario) {
    return this.usuarioService.findAllEmpleadosDeAreaDelUsuario(
      String(req.usuario._id),
    );
  }

  // --- 2. GESTIÓN DE CLIENTES (Para el Admin) ---
  
  // Endpoint específico (por si el front lo usa explícitamente)
  @Post('registrar-cliente')
  @UseGuards(AuthGuard)
  async createCliente(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Req() req: RequestWithUsuario,
  ): Promise<RespuestaUsuarioDto> {
    const dtoCliente = { ...createUsuarioDto, rol: RolesEnum.CLIENTE };
    return this.usuarioService.create(dtoCliente, req.usuario);
  }

  // --- 3. ENDPOINTS GENERALES (CRUD Básico) ---

  // ¡IMPORTANTE! Este es el que usa tu ClientesService.ts actualmente (POST /usuarios)
  // Ahora tiene AuthGuard para pasar el usuario al servicio y evitar el error.
  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Req() req: RequestWithUsuario,
  ): Promise<RespuestaUsuarioDto> {
    return this.usuarioService.create(createUsuarioDto, req.usuario);
  }

  // Listado general con Paginación (y filtros de Rol/Búsqueda)
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<RespuestaUsuarioDto[]> {
    return this.usuarioService.findAll(paginationDto);
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

  // --- 4. GESTIÓN DE ENCARGADOS (Admin) ---
  
  @UseGuards(AuthGuard, PermisosGuard)
  @PermisoRequerido(PermisosEnum.CREAR_USUARIOS)
  @Post('encargados')
  async createEncargado(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    const dtoEncargado = { ...createUsuarioDto, rol: RolesEnum.ENCARGADO_DE_AREA };
    return this.usuarioService.create(dtoEncargado);
  }

  @UseGuards(AuthGuard, PermisosGuard)
  @PermisoRequerido(PermisosEnum.CREAR_USUARIOS)
  @Patch('encargados/:id')
  async updateEncargado(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    return this.usuarioService.updateEncargado(id, updateUsuarioDto);
  }

  @UseGuards(AuthGuard, PermisosGuard)
  @PermisoRequerido(PermisosEnum.CREAR_USUARIOS)
  @Delete('encargados/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeEncargado(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<void> {
    await this.usuarioService.removeEncargado(id);
  }

  // --- 5. RECUPERACIÓN DE CONTRASEÑA ---

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.usuarioService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.usuarioService.resetPassword(dto.token, dto.contraseña);
  }
}