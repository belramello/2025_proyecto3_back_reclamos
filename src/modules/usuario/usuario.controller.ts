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
import { AuthGuard } from 'src/middlewares/auth.middleware';
import type { RequestWithUsuario } from 'src/middlewares/auth.middleware';
import { EmpleadoDeSubareaDto } from './dto/empleado-de-subarea.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    return this.usuarioService.create(createUsuarioDto);
  }

  @UseGuards(AuthGuard)
  @Get('/empleados-subarea')
  async findAllEmpleadosDeSubarea(
    @Req() req: RequestWithUsuario,
  ): Promise<EmpleadoDeSubareaDto[]> {
    return await this.usuarioService.findAllEmpleadosDeSubareaDelUsuario(
      String(req.usuario._id),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/empleados-area')
  async findAllEmpleadosDeArea(
    @Req() req: RequestWithUsuario,
  ): Promise<EmpleadoDeSubareaDto[]> {
    return await this.usuarioService.findAllEmpleadosDeAreaDelUsuario(
      String(req.usuario._id),
    );
  }

  @Get()
  async findAll(): Promise<RespuestaUsuarioDto[]> {
    return this.usuarioService.findAll();
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
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content es común para eliminaciones exitosas
  async remove(@Param('id', ParseMongoIdPipe) id: string): Promise<void> {
    // El servicio lanza la excepción si no lo encuentra.
    await this.usuarioService.remove(id);
  }
}
