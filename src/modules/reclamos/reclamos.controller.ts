import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReclamosService } from './reclamos.service';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto';
import type { RequestWithUsuario } from 'src/middlewares/auth.middleware';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PermisoRequerido } from 'src/common/decorators/permiso-requerido.decorator';
import { PermisosEnum } from '../permisos/enums/permisos-enum';

@Controller('reclamos')
export class ReclamosController {
  constructor(private readonly reclamosService: ReclamosService) {}

  @Post()
  create(@Body() createReclamoDto: CreateReclamoDto) {
    return this.reclamosService.create(createReclamoDto);
  }

  @Get()
  findAll() {
    return this.reclamosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reclamosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReclamoDto: UpdateReclamoDto) {
    return this.reclamosService.update(+id, updateReclamoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reclamosService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @PermisoRequerido(PermisosEnum.AUTO_ASIGNAR_RECLAMO)
  @Patch('autoasignar/:id')
  autoasignarReclamo(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: RequestWithUsuario,
  ) {
    return this.reclamosService.autoasignarReclamo(id, req.usuario);
  }
}
