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
import type { RequestWithUsuario } from '../../middlewares/auth.middleware';
import { AuthGuard } from '../../middlewares/auth.middleware';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';
import { PermisoRequerido } from '../../common/decorators/permiso-requerido.decorator';
import { PermisosEnum } from '../permisos/enums/permisos-enum';
import { EmpleadoAASignarDto } from './dto/empleado-a-asignar.dto';
import { SubareaAAsignarDto } from './dto/subarea-a-asignar.dto';
import { AreaAAsignarDto } from './dto/area-a-asignar.dto';
import Document from 'mongoose';

@Controller('reclamos')
export class ReclamosController {
  constructor(private readonly reclamosService: ReclamosService) {}
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createReclamoDto: CreateReclamoDto,
    @Req() req: RequestWithUsuario,
  ) {
    return await this.reclamosService.crearReclamo(
      createReclamoDto,
      req.usuario, 
    );
  }


  @Get()
  findAll() {
    return this.reclamosService.findAll();
  }

  //NO FUNCIONA
  @UseGuards(AuthGuard)
  @PermisoRequerido(PermisosEnum.ASIGNAR_RECLAMOS)
  @Get('reclamos-area')
  obtenerReclamosPendientesDeArea(@Req() req: RequestWithUsuario) {
    return this.reclamosService.obtenerReclamosPendientesDeArea(req.usuario);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reclamosService.findOne(id);
  }

  @UseGuards(AuthGuard)
  //@PermisoRequerido(PermisosEnum.VISUALIZAR_ESTADO_RECLAMO)
  @Get('historial/:id')
  consultarHistorialReclamo(@Param('id', ParseMongoIdPipe) id: string) {
    return this.reclamosService.consultarHistorialReclamo(id);
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

  @UseGuards(AuthGuard)
  @PermisoRequerido(PermisosEnum.ASIGNAR_RECLAMOS)
  @Patch('asignar-subarea/:id')
  asignarReclamoASubarea(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: RequestWithUsuario,
    @Body() subareaAAsignarDto: SubareaAAsignarDto,
  ) {
    return this.reclamosService.asignarReclamoASubarea(
      id,
      req.usuario,
      subareaAAsignarDto.subareaId,
      subareaAAsignarDto.comentario,
    );
  }

  @UseGuards(AuthGuard)
  @PermisoRequerido(PermisosEnum.ASIGNAR_RECLAMO_A_EMPLEADO)
  @Patch('asignar-empleado/:id')
  asignarReclamoAEmpleado(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: RequestWithUsuario,
    @Body() empleadoAAsignarDto: EmpleadoAASignarDto,
  ) {
    return this.reclamosService.asignarReclamoAEmpleado(
      id,
      req.usuario,
      empleadoAAsignarDto.empleadoId,
    );
  }

  @UseGuards(AuthGuard)
  @PermisoRequerido(PermisosEnum.ASIGNAR_RECLAMOS)
  @Patch('asignar-area/:id')
  asignarReclamoAArea(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: RequestWithUsuario,
    @Body() areaAAsignarDto: AreaAAsignarDto,
  ) {
    return this.reclamosService.asignarReclamoAArea(
      id,
      req.usuario,
      areaAAsignarDto.areaId,
    );
  }

  @UseGuards(AuthGuard)
  @PermisoRequerido(PermisosEnum.ASIGNAR_RECLAMOS)
  @Patch('reasignar-empleado/:id')
  reasignacionReclamoAEmpleado(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: RequestWithUsuario,
    @Body() empleadoAAsignarDto: EmpleadoAASignarDto,
  ) {
    return this.reclamosService.reasignarReclamoAEmpleado(
      id,
      req.usuario,
      empleadoAAsignarDto.empleadoId,
    );
  }

  @UseGuards(AuthGuard)
  @PermisoRequerido(PermisosEnum.ASIGNAR_RECLAMOS)
  @Patch('reasignar-subarea/:id')
  reasignacionReclamoASubarea(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: RequestWithUsuario,
    @Body() subareaAAsignarDto: SubareaAAsignarDto,
  ) {
    return this.reclamosService.reasignarReclamoASubarea(
      id,
      req.usuario,
      subareaAAsignarDto.subareaId,
    );
  }

  @UseGuards(AuthGuard)
  @PermisoRequerido(PermisosEnum.ASIGNAR_RECLAMOS)
  @Patch('reasignar-area/:id')
  reasignacionReclamoAArea(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: RequestWithUsuario,
    @Body() areaAAsignarDto: AreaAAsignarDto,
  ) {
    return this.reclamosService.reasignarReclamoAArea(
      id,
      req.usuario,
      areaAAsignarDto.areaId,
    );
  }

  //NO FUNCIONA
  @UseGuards(AuthGuard)
  @Get('consultar-reclamos-asignados')
  obtenerMisReclamosAsignados(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: RequestWithUsuario,
  ) {
    return this.reclamosService.obtenerReclamosAsignados(
      String(req.usuario._id),
    );
  }
  // BORRA ESTO BELU CUANDO HAGAS LA LOGICA DE RECLAMOS QUE ES LA SIMULACIÓN DE NOTIFICACIÓN
  @Post('test-mail')
  async testMail(@Body() body: { email: string }) {
    return this.reclamosService.simularNotificacion(body.email);
  }
}
