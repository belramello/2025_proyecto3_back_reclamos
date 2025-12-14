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
import type { RequestWithUsuario } from '../../middlewares/auth.middleware';
import { AuthGuard } from '../../middlewares/auth.middleware';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';
import { PermisoRequerido } from '../../common/decorators/permiso-requerido.decorator';
import { PermisosEnum } from '../permisos/enums/permisos-enum';
import { EmpleadoAASignarDto } from './dto/empleado-a-asignar.dto';
import { SubareaAAsignarDto } from './dto/subarea-a-asignar.dto';
import { AreaAAsignarDto } from './dto/area-a-asignar.dto';
import { ReclamoEnMovimientoDto } from './dto/reclamo-en-movimiento.dto';
import { PermisosGuard } from 'src/common/guards/permisos.guard';
import { ReclamosDelClienteDto } from './dto/reclamos-del-cliente.dto';
import type { CerrarReclamoDto } from './dto/cerrar-reclamo.dto';

@Controller('reclamos')
export class ReclamosController {
  constructor(private readonly reclamosService: ReclamosService) {}

  @UseGuards(AuthGuard, PermisosGuard)
  @PermisoRequerido(PermisosEnum.REGISTRAR_RECLAMO)
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

  @UseGuards(AuthGuard, PermisosGuard)
  @PermisoRequerido(PermisosEnum.CERRAR_RECLAMO)
  @Post('cerrar')
  async cerrarReclamo(
    @Body() cerrarReclamoDto: CerrarReclamoDto,
    @Req() req: RequestWithUsuario,
  ) {
    return await this.reclamosService.cerrarReclamo(
      cerrarReclamoDto,
      req.usuario,
    );
  }

  @UseGuards(AuthGuard)
  @Get('reclamos-cliente')
  obtenerReclamosDelCliente(
    @Req() req: RequestWithUsuario,
  ): Promise<ReclamosDelClienteDto[]> {
    return this.reclamosService.obtenerReclamosDelCliente(req.usuario);
  }

  @UseGuards(AuthGuard)
  @PermisoRequerido(PermisosEnum.ASIGNAR_RECLAMOS)
  @Get('reclamos-area')
  obtenerReclamosAsignadosAUnArea(
    @Req() req: RequestWithUsuario,
  ): Promise<ReclamoEnMovimientoDto[]> {
    return this.reclamosService.obtenerReclamosAsignadosAUnArea(req.usuario);
  }

  @UseGuards(AuthGuard)
  @Get('consultar-reclamos-asignados')
  obtenerMisReclamosAsignados(
    @Req() req: RequestWithUsuario,
  ): Promise<ReclamoEnMovimientoDto[]> {
    return this.reclamosService.obtenerReclamosAsignados(
      String(req.usuario._id),
    );
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

  // BORRA ESTO BELU CUANDO HAGAS LA LOGICA DE RECLAMOS QUE ES LA SIMULACIÓN DE NOTIFICACIÓN
  @Post('test-mail')
  async testMail(@Body() body: { email: string }) {
    return this.reclamosService.simularNotificacion(body.email);
  }
}
