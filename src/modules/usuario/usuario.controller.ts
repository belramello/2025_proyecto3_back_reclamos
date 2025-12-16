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
import { EmpleadoDto } from './dto/empleado-de-subarea.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @UseGuards(AuthGuard, PermisosGuard)
  @PermisoRequerido(PermisosEnum.CREAR_USUARIOS)
  @Post('gestion-empleados')
  async createEmpleado(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Req() req: RequestWithUsuario,
  ): Promise<RespuestaUsuarioDto> {
    const dtoEmpleado = { ...createUsuarioDto, rol: RolesEnum.EMPLEADO };
    return this.usuarioService.create(dtoEmpleado, req.usuario);
  }

  @Post('registrar-cliente')
  @UseGuards(AuthGuard, PermisosGuard)
  @PermisoRequerido(PermisosEnum.CREAR_USUARIOS)
  async createCliente(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Req() req: RequestWithUsuario,
  ): Promise<RespuestaUsuarioDto> {
    const dtoCliente = { ...createUsuarioDto, rol: RolesEnum.CLIENTE };
    console.log('DTO Cliente:', dtoCliente);
    console.log('Usuario que registra:', req.usuario);
    return this.usuarioService.create(dtoCliente, req.usuario);}

  @Delete('gestion-empleados/:id')
  @UseGuards(AuthGuard, PermisosGuard)
  @PermisoRequerido(PermisosEnum.CREAR_USUARIOS)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeEmpleado(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<void> {
    await this.usuarioService.removeEmpleado(id);
  }

  @Get('empleados-subarea')
  @UseGuards(AuthGuard, PermisosGuard)
  @PermisoRequerido(PermisosEnum.MOVER_RECLAMO)
  async findAllEmpleadosDeSubarea(
    @Req() req: RequestWithUsuario,
  ): Promise<EmpleadoDto[]> {
    return this.usuarioService.findAllEmpleadosDeSubareaDelUsuario(
      String(req.usuario._id),
    );
  }

  @Get('empleados-area')
  @UseGuards(AuthGuard, PermisosGuard)
  @PermisoRequerido(PermisosEnum.ASIGNAR_RECLAMOS)
  async findAllEmpleadosDeArea(
    @Req() req: RequestWithUsuario,
  ): Promise<EmpleadoDto[]> {
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

  @UseGuards(AuthGuard, PermisosGuard)
  @PermisoRequerido(PermisosEnum.CREAR_USUARIOS)
  @Post('encargados')
  async createEncargado(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    const dtoEncargado = {
      ...createUsuarioDto,
      rol: RolesEnum.ENCARGADO_DE_AREA,
    };
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

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.usuarioService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.usuarioService.resetPassword(dto.token, dto.contraseña);
  }
}