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
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RespuestaUsuarioDto } from './dto/respuesta-usuario.dto'; // Asumimos que este DTO existe
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // POST /usuarios
  @Post()
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    return this.usuarioService.create(createUsuarioDto);
  }

  // GET /usuarios
  @Get()
  async findAll(): Promise<RespuestaUsuarioDto[]> {
    return this.usuarioService.findAll();
  }

  // GET /usuarios/:id
  @Get(':id')
  async findOne(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<RespuestaUsuarioDto> {
    return this.usuarioService.findOne(id);
  }

  // PATCH /usuarios/:id
  @Patch(':id')
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<RespuestaUsuarioDto> {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  // DELETE /usuarios/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content es común para eliminaciones exitosas
  async remove(@Param('id', ParseMongoIdPipe) id: string): Promise<void> {
    // El servicio lanza la excepción si no lo encuentra.
    await this.usuarioService.remove(id);
  }
}
