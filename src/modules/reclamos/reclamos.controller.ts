import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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
import { RespuestaCreateReclamoDto } from './dto/respuesta-create-reclamo.dto';
import { RespuestaCerrarReclamoDto } from './dto/respuesta-cerrar-reclamo.dto';
import { RespuestaHistorialReclamoDto } from './dto/respuesta-historial-reclamo.dto';

@UseGuards(AuthGuard, PermisosGuard)
@Controller('reclamos')
export class ReclamosController {
  constructor(private readonly reclamosService: ReclamosService) {}

  
  @PermisoRequerido(PermisosEnum.AUTO_ASIGNAR_RECLAMO)
  @Get('reclamos-subarea')
  obtenerReclamosAsignadosAUnSubArea(
    @Req() req: RequestWithUsuario,
  ): Promise<ReclamoEnMovimientoDto[]> {
    return this.reclamosService.obtenerReclamosAsignadosAUnSubArea(req.usuario);
  }

  @PermisoRequerido(PermisosEnum.REGISTRAR_RECLAMO)
  @Post()
  async create(
    @Body() createReclamoDto: CreateReclamoDto,
    @Req() req: RequestWithUsuario,
  ): Promise<RespuestaCreateReclamoDto> {
    return await this.reclamosService.crearReclamo(
      createReclamoDto,
      req.usuario,
    );
  }

  @PermisoRequerido(PermisosEnum.CERRAR_RECLAMO)
  @Post('cerrar')
  async cerrarReclamo(
    @Body() cerrarReclamoDto: CerrarReclamoDto,
    @Req() req: RequestWithUsuario,
  ): Promise<RespuestaCerrarReclamoDto> {
    return await this.reclamosService.cerrarReclamo(
      cerrarReclamoDto,
      req.usuario,
    );
  }

  @Get('reclamos-cliente')
  obtenerReclamosDelCliente(
    @Req() req: RequestWithUsuario,
  ): Promise<ReclamosDelClienteDto[]> {
    return this.reclamosService.obtenerReclamosDelCliente(req.usuario);
  }

  @PermisoRequerido(PermisosEnum.ASIGNAR_RECLAMOS)
  @Get('reclamos-area')
  obtenerReclamosAsignadosAUnArea(
    @Req() req: RequestWithUsuario,
  ): Promise<ReclamoEnMovimientoDto[]> {
    return this.reclamosService.obtenerReclamosAsignadosAUnArea(req.usuario);
  }

  @PermisoRequerido(PermisosEnum.AUTO_ASIGNAR_RECLAMO)
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

  //@PermisoRequerido(PermisosEnum.VISUALIZAR_ESTADO_RECLAMO)
  @Get('historial/:id')
  consultarHistorialReclamo(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<RespuestaHistorialReclamoDto> {
    return this.reclamosService.consultarHistorialReclamo(id);
  }

  @PermisoRequerido(PermisosEnum.AUTO_ASIGNAR_RECLAMO)
  @Patch('autoasignar/:id')
  autoasignarReclamo(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: RequestWithUsuario,
  ): Promise<void> {
    return this.reclamosService.autoasignarReclamo(id, req.usuario);
  }

  @PermisoRequerido(PermisosEnum.ASIGNAR_RECLAMOS)
  @Patch('asignar-subarea/:id')
  asignarReclamoASubarea(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: RequestWithUsuario,
    @Body() subareaAAsignarDto: SubareaAAsignarDto,
  ): Promise<void> {
    return this.reclamosService.asignarReclamoASubarea(
      id,
      req.usuario,
      subareaAAsignarDto.subareaId,
      subareaAAsignarDto.comentario,
    );
  }

  @PermisoRequerido(PermisosEnum.ASIGNAR_RECLAMO_A_EMPLEADO)
  @Patch('asignar-empleado/:id')
  asignarReclamoAEmpleado(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: RequestWithUsuario,
    @Body() empleadoAAsignarDto: EmpleadoAASignarDto,
  ): Promise<void> {
    return this.reclamosService.asignarReclamoAEmpleado(
      id,
      req.usuario,
      empleadoAAsignarDto.empleadoId,
    );
  }

  @PermisoRequerido(PermisosEnum.ASIGNAR_RECLAMOS)
  @Patch('asignar-area/:id')
  asignarReclamoAArea(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: RequestWithUsuario,
    @Body() areaAAsignarDto: AreaAAsignarDto,
  ): Promise<void> {
    return this.reclamosService.asignarReclamoAArea(
      id,
      req.usuario,
      areaAAsignarDto.areaId,
    );
  }

  @PermisoRequerido(PermisosEnum.MOVER_RECLAMO)
  @Patch('reasignar-empleado/:id')
  reasignacionReclamoAEmpleado(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: RequestWithUsuario,
    @Body() empleadoAAsignarDto: EmpleadoAASignarDto,
  ): Promise<void> {
    return this.reclamosService.reasignarReclamoAEmpleado(
      id,
      req.usuario,
      empleadoAAsignarDto.empleadoId,
    );
  }

  @PermisoRequerido(PermisosEnum.MOVER_RECLAMO)
  @Patch('reasignar-subarea/:id')
  reasignacionReclamoASubarea(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: RequestWithUsuario,
    @Body() subareaAAsignarDto: SubareaAAsignarDto,
  ): Promise<void> {
    return this.reclamosService.reasignarReclamoASubarea(
      id,
      req.usuario,
      subareaAAsignarDto.subareaId,
    );
  }

  @PermisoRequerido(PermisosEnum.MOVER_RECLAMO)
  @Patch('reasignar-area/:id')
  reasignacionReclamoAArea(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: RequestWithUsuario,
    @Body() areaAAsignarDto: AreaAAsignarDto,
  ): Promise<void> {
    return this.reclamosService.reasignarReclamoAArea(
      id,
      req.usuario,
      areaAAsignarDto.areaId,
    );
  }

}
