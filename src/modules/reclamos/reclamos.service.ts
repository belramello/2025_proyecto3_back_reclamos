import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import type { IReclamosRepository } from './repositories/reclamos-repository.interface';
import { ReclamoDocumentType } from './schemas/reclamo.schema';
import { ReclamosValidator } from './helpers/reclamos-validator';
import { Usuario, UsuarioDocumentType } from '../usuario/schema/usuario.schema';
import { MailService } from '../mail/mail.service';
import { RespuestaCreateReclamoDto } from './dto/respuesta-create-reclamo.dto';
import { ReclamosMapper } from './helpers/reclamos-mapper';
import { ReclamoEnMovimientoDto } from './dto/reclamo-en-movimiento.dto';
import { ReclamosHelper } from './helpers/reclamos-helper';
import { ReclamosDelClienteDto } from './dto/reclamos-del-cliente.dto';
import { CerrarReclamoDto } from './dto/cerrar-reclamo.dto';
import { RespuestaCerrarReclamoDto } from './dto/respuesta-cerrar-reclamo.dto';
import { RespuestaHistorialReclamoDto } from './dto/respuesta-historial-reclamo.dto';

@Injectable()
export class ReclamosService {
  constructor(
    @Inject('IReclamosRepository')
    private readonly reclamosRepository: IReclamosRepository,
    @Inject(forwardRef(() => ReclamosValidator))
    private readonly reclamosValidator: ReclamosValidator,
    private readonly mailService: MailService,
    private readonly reclamosMapper: ReclamosMapper,
    private readonly reclamosHelper: ReclamosHelper,
  ) {}

  async crearReclamo(
    createReclamoDto: CreateReclamoDto,
    cliente: UsuarioDocumentType,
  ): Promise<RespuestaCreateReclamoDto> {
    await this.reclamosValidator.validateCliente(cliente);
    const proyecto = await this.reclamosValidator.validateProyectoDeCliente(
      cliente,
      createReclamoDto.proyecto,
    );
    const tipoReclamo = await this.reclamosValidator.validateTipoReclamo(
      createReclamoDto.tipoReclamo,
    );
    const reclamoCreado = await this.reclamosRepository.crearReclamo(
      createReclamoDto,
      this.reclamosHelper.generarNroDeTicket(),
      cliente,
      proyecto,
      tipoReclamo,
    );
    await this.mailService.enviarNotificacionCreacionReclamo(
      cliente.email,
      reclamoCreado.nroTicket,
      reclamoCreado.titulo,
      new Date(),
    );
    return this.reclamosMapper.toRespuestaCreateReclamoDto(reclamoCreado);
  }

  async cerrarReclamo(
    cerrarReclamo: CerrarReclamoDto,
    usuario: UsuarioDocumentType,
  ): Promise<RespuestaCerrarReclamoDto> {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(
      cerrarReclamo.reclamoId,
    );
    await this.reclamosValidator.validateReclamoNoResuelto(reclamo);
    await this.reclamosRepository.cerrarReclamo(
      reclamo,
      cerrarReclamo.resumenResolucion,
      usuario,
    );
    await this.notificarCliente(
      reclamo,
      'Reclamo Cerrado',
      `El reclamo fue resuelto con éxito, el resumen de resolución es: ${reclamo.resumenResolucion}`,
    );
    return this.reclamosMapper.toRespuestaCerrarReclamoDto(reclamo);
  }
  async obtenerReclamosDelCliente(
    cliente: UsuarioDocumentType,
  ): Promise<ReclamosDelClienteDto[]> {
    await this.reclamosValidator.validateCliente(cliente);
    const reclamos = await this.reclamosRepository.obtenerReclamosDelCliente(
      String(cliente._id),
    );
    return this.reclamosMapper.toReclamosDelClienteList(reclamos);
  }

  async findOne(id: string): Promise<ReclamoDocumentType | null> {
    return await this.reclamosRepository.findOne(id);
  }

  async consultarHistorialReclamo(
    id: string,
  ): Promise<RespuestaHistorialReclamoDto> {
    await this.reclamosValidator.validateReclamoExistente(id);
    const reclamo = await this.reclamosRepository.consultarHistorialReclamo(id);
    return this.reclamosMapper.toRespuestaHistorialReclamoDto(reclamo);
  }

  async autoasignarReclamo(id: string, empleado: Usuario) {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    const estadoActual =
      await this.reclamosValidator.validateReclamoNoResuelto(reclamo);
    const subarea = await this.reclamosValidator.validateAreaYSubareaReclamo(
      reclamo,
      empleado,
    );
    await this.reclamosRepository.autoasignar(
      reclamo,
      empleado,
      subarea,
      estadoActual,
    );
    await this.notificarCliente(
      reclamo,
      'En Proceso',
      `El reclamo fue tomado por ${empleado.nombre}`,
    );
  }

  async asignarReclamoASubarea(
    id: string,
    empleado: Usuario,
    subareaId: string,
    comentario?: string,
  ): Promise<void> {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    await this.reclamosValidator.validateReclamoNoResuelto(reclamo);
    const area = await this.reclamosValidator.validateAreaReclamoParaEncargado(
      reclamo,
      empleado,
    );
    const subarea =
      await this.reclamosValidator.validateSubareaExistenteYValida(
        subareaId,
        area,
      );
    await this.reclamosRepository.asignarReclamoASubarea(
      reclamo,
      subarea,
      comentario,
    );
    await this.notificarCliente(
      reclamo,
      'Pendiente de Asignación',
      `Derivado a subárea: ${subarea.nombre}`,
    );
  }

  async asignarReclamoAEmpleado(
    id: string,
    encargado: Usuario,
    empleadoId: string,
    comentario?: string,
  ): Promise<void> {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    const estadoActual =
      await this.reclamosValidator.validateReclamoNoResuelto(reclamo);
    const area = await this.reclamosValidator.validateAreaReclamoParaEncargado(
      reclamo,
      encargado,
    );
    const [subareaDeEmpleado, empleado] =
      await this.reclamosValidator.validateEmpleadoExistenteYValido(
        empleadoId,
        area,
      );
    await this.reclamosRepository.asignarReclamoAEmpleado(
      reclamo,
      encargado,
      subareaDeEmpleado,
      empleado,
      estadoActual,
      comentario,
    );
    await this.notificarCliente(
      reclamo,
      'En Proceso',
      `Asignado a responsable: ${empleado.nombre}`,
    );
  }

  async asignarReclamoAArea(
    id: string,
    encargado: Usuario,
    areaId: string,
    comentario?: string,
  ): Promise<void> {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    const estadoActual =
      await this.reclamosValidator.validateReclamoNoResuelto(reclamo);
    const areaOrigen =
      await this.reclamosValidator.validateAreaReclamoParaEncargado(
        reclamo,
        encargado,
      );
    const areaDestino =
      await this.reclamosValidator.validateAreaExistente(areaId);
    await this.reclamosRepository.asignarReclamoAArea(
      reclamo,
      areaOrigen,
      areaDestino,
      comentario,
    );
    await this.notificarCliente(
      reclamo,
      estadoActual,
      `Transferido al Área: ${areaDestino.nombre}`,
    );
  }

  async reasignarReclamoAEmpleado(
    id: string,
    empleadoOrigen: Usuario,
    empleadoDestinoId: string,
    comentario?: string,
  ): Promise<void> {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    await this.reclamosValidator.validateReclamoEnProceso(reclamo);
    this.reclamosValidator.validateEmpleadoAsignado(reclamo, empleadoOrigen);
    const [empleadoDestino, subarea] =
      await this.reclamosValidator.validateEmpleadoExistenteYConSubarea(
        empleadoDestinoId,
        empleadoOrigen,
      );
    await this.reclamosRepository.reasignarReclamoAEmpleado(
      reclamo,
      empleadoOrigen,
      empleadoDestino,
      subarea,
      comentario,
    );
    await this.notificarCliente(
      reclamo,
      'En Proceso',
      `Reasignado a: ${empleadoDestino.nombre}`,
    );
  }

  async reasignarReclamoASubarea(
    id: string,
    empleado: Usuario,
    subareaId: string,
    comentario?: string,
  ): Promise<void> {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    await this.reclamosValidator.validateReclamoEnProceso(reclamo);
    const subareaOrigen =
      await this.reclamosValidator.validateEmpleadoConSubarea(empleado);
    this.reclamosValidator.validateEmpleadoAsignado(reclamo, empleado);
    const subareaDestino =
      await this.reclamosValidator.validateSubareaExistenteYValida(
        subareaId,
        subareaOrigen.area,
      );
    await this.reclamosRepository.reasignarReclamoASubarea(
      reclamo,
      empleado,
      subareaOrigen,
      subareaDestino,
      comentario,
    );
    await this.notificarCliente(
      reclamo,
      'Pendiente de Asignación',
      `Movido a subárea: ${subareaDestino.nombre}`,
    );
  }

  async reasignarReclamoAArea(
    id: string,
    empleado: Usuario,
    areaId: string,
    comentario?: string,
  ): Promise<void> {
    const reclamo = await this.reclamosValidator.validateReclamoExistente(id);
    await this.reclamosValidator.validateReclamoEnProceso(reclamo);
    const subareaOrigen =
      await this.reclamosValidator.validateEmpleadoConSubarea(empleado);
    this.reclamosValidator.validateEmpleadoAsignado(reclamo, empleado);
    const areaDestino =
      await this.reclamosValidator.validateAreaExistente(areaId);
    await this.reclamosRepository.reasignarReclamoAArea(
      reclamo,
      empleado,
      subareaOrigen,
      areaDestino,
      comentario,
    );
    await this.notificarCliente(
      reclamo,
      'Pendiente de Asignación',
      `Transferido al Área: ${areaDestino.nombre}`,
    );
  }

  async obtenerReclamosAsignados(
    empleadoId: string,
  ): Promise<ReclamoEnMovimientoDto[]> {
    await this.reclamosValidator.validateEmpleadoExistente(empleadoId);
    const reclamos =
      await this.reclamosRepository.obtenerReclamosAsignadosDeEmpleado(
        empleadoId,
      );
    return this.reclamosMapper.toReclamoEnMovimientoDtos(reclamos);
  }

  async obtenerReclamosAsignadosAUnArea(
    encargado: Usuario,
  ): Promise<ReclamoEnMovimientoDto[]> {
    const area = await this.reclamosValidator.validateEncargado(encargado);
    const reclamos =
      await this.reclamosRepository.obtenerReclamosAsignadosAUnArea(
        area.nombre,
      );
    return this.reclamosMapper.toReclamoEnMovimientoDtos(reclamos);
  }

  //helper para el envío de mail.
  private async notificarCliente(
    reclamo: ReclamoDocumentType,
    nuevoEstado: string,
    mensaje: string,
  ): Promise<void> {
    try {
      let emailCliente: string | null = null;
      const usuario: any = reclamo.usuario;
      if (usuario && usuario.email) {
        emailCliente = usuario.email;
      }
      if (!emailCliente) {
        const proyecto: any = reclamo.proyecto;
        if (proyecto && proyecto.cliente && proyecto.cliente.email) {
          emailCliente = proyecto.cliente.email;
        }
      }
      if (emailCliente) {
        await this.mailService.sendReclamoNotification(
          emailCliente,
          reclamo.nroTicket,
          reclamo.titulo,
          nuevoEstado,
          mensaje,
        );
      }
    } catch (error) {
      console.error(
        `Error no bloqueante enviando notificación reclamo ${reclamo.nroTicket}:`,
        error,
      );
    }
  }


  async obtenerReclamosAsignadosAUnSubArea(
    empleado: Usuario,
  ): Promise<ReclamoEnMovimientoDto[]> {
    console.log('Empleado que realiza la consulta:', empleado);
    const subarea =
      await this.reclamosValidator.validateEmpleadoConSubarea(empleado);
      console.log('Subarea del empleado:', subarea);
    const reclamos =
      await this.reclamosRepository.obtenerReclamosAsignadosAUnSubArea(
        subarea.nombre,
      );
    console.log(reclamos);
    return this.reclamosMapper.toReclamoEnMovimientoDtos(reclamos);
  }
}
