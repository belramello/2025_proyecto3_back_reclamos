import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto';
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
  //ME FALTA POR HACER, VOY A SEGUIR LA LÓGICA QUE HICIERON @MARTIN
  //async registrarReclamoResuelto()
  async obtenerReclamosDelCliente(
    req: UsuarioDocumentType,
  ): Promise<ReclamosDelClienteDto[]> {
    console.log('SERVICE usuario._id:', req._id);
    await this.reclamosValidator.validateCliente(req);
    const reclamos = await this.reclamosRepository.obtenerReclamosDelCliente(
      String(req._id),
    );
    console.log('SERVICE reclamos encontrados:', reclamos.length);
    return this.reclamosMapper.toReclamosDelClienteList(reclamos);
  }

  async findOne(id: string): Promise<ReclamoDocumentType | null> {
    return await this.reclamosRepository.findOne(id);
  }

  update(id: number, updateReclamoDto: UpdateReclamoDto) {
    return `This action updates a #${id} reclamo`;
  }
  remove(id: number) {
    return `This action removes a #${id} reclamo`;
  }

  async consultarHistorialReclamo(id: string) {
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
  ) {
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

    // Notificación
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
  ) {
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

    // Notificación
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
  ) {
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

    // Notificación
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
  ) {
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

    // Notificación
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
  ) {
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

    // Notificación
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
  ) {
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

    // Notificación
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

  // --- HELPER PRIVADO PARA ENVIAR EL MAIL ---
  private async notificarCliente(
    reclamo: ReclamoDocumentType,
    nuevoEstado: string,
    mensaje: string,
  ) {
    try {
      let emailCliente: string | null = null;

      // Intentamos obtener el mail del campo 'usuario' (si existe en el schema actualizado)
      const usuario: any = reclamo.usuario;
      if (usuario && usuario.email) {
        emailCliente = usuario.email;
      }

      // Si no, intentamos vía proyecto -> cliente
      if (!emailCliente) {
        const proyecto: any = reclamo.proyecto;
        if (proyecto && proyecto.cliente && proyecto.cliente.email) {
          emailCliente = proyecto.cliente.email;
        }
      }

      // Si encontramos email, enviamos
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
  // BORRA ESTO BELU CUANDO HAGAS LA LOGICA DE RECLAMOS QUE ES LA SIMULACIÓN DE NOTIFICACIÓN
  // --- MÉTODO TEMPORAL PARA PROBAR EN POSTMAN ---
  async simularNotificacion(emailDestino: string) {
    console.log('🧪 Iniciando prueba de mail manual...');
    await this.mailService.sendReclamoNotification(
      emailDestino,
      'TICKET-9999', // Nro Ticket Falso
      'Reclamo de Prueba', // Título Falso
      'Resuelto', // Nuevo Estado
      'Esta es una prueba manual desde Postman para verificar la conexión SMTP.',
    );
    return {
      message: 'Prueba de correo ejecutada. Revisa tu bandeja de entrada.',
    };
  }
}
