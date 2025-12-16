import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    UseGuards, 
    Req, 
    Query,
    Delete, // Importar Delete
    HttpCode, // Importar HttpCode
    HttpStatus, // Importar HttpStatus
    InternalServerErrorException // Necesario para ParseMongoIdPipe si no está importado
} from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import type { RequestWithUsuario } from 'src/middlewares/auth.middleware';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe'; // Necesario para validar el ID

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

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
  ) {
    return this.proyectosService.findAll(paginationDto);
  }

  @Get('cliente/:clienteId')
  findByCliente(@Param('clienteId', ParseMongoIdPipe) clienteId: string) { // Añadir ParseMongoIdPipe
    return this.proyectosService.findAllByCliente(clienteId);
  }

  // --- ¡RUTA DELETE AÑADIDA! ---
  @Delete(':id')
  @UseGuards(AuthGuard) // Proteger la ruta, solo usuarios autenticados pueden eliminar
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 si la eliminación fue exitosa
  async remove(@Param('id', ParseMongoIdPipe) id: string): Promise<void> {
    await this.proyectosService.remove(id);
  }
  // -----------------------------
}