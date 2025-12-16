/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ReclamosService } from '../../../modules/reclamos/reclamos.service';
import { UsuarioService } from '../../../modules/usuario/usuario.service';
import { Types } from 'mongoose';
import type { IFeedbackRepository } from '../repository/feedback-repository.interface';
import { ReclamoDocumentType } from 'src/modules/reclamos/schemas/reclamo.schema';

@Injectable()
export class FeedbackValidator {
  constructor(
    private readonly reclamosService: ReclamosService,
    private readonly usuariosService: UsuarioService,

    @Inject('IFeedbackRepository')
    private readonly feedbackRepository: IFeedbackRepository,
  ) {}

  /** 1. Validar que el reclamo existe */
  async validateReclamoExistente(reclamoId: string) {
    const reclamo = await this.reclamosService.findOne(reclamoId);
    if (!reclamo) {
      throw new NotFoundException(`El reclamo con ID ${reclamoId} no existe`);
    }
    return reclamo;
  }

  /** 2. Validar que el usuario existe */
  async validateUsuarioExistente(usuarioId: string) {
    const usuario = await this.usuariosService.findOne(usuarioId);

    if (!usuario) {
      throw new NotFoundException(`El usuario con ID ${usuarioId} no existe`);
    }

    return usuario;
  }

  /** 3. Validar que el usuario es el cliente del reclamo */
  validateUsuarioEsCliente(reclamo: any, usuarioId: string) {
    if (!reclamo.proyecto) {
      throw new BadRequestException(
        'El reclamo no contiene el proyecto asociado',
      );
    }

    if (!reclamo.proyecto.cliente) {
      throw new BadRequestException(
        'El proyecto no contiene el cliente asociado',
      );
    }

    // Si no está poblado, da error
    if (reclamo.proyecto.cliente instanceof Types.ObjectId) {
      throw new BadRequestException(
        'El reclamo no está completamente poblado (cliente no poblado)',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (reclamo.proyecto.cliente._id.toString() !== usuarioId) {
      throw new UnauthorizedException(
        'El usuario no puede dejar feedback de un reclamo que no le pertenece',
      );
    }
  }

  /** 4. Validar que no exista feedback previo del mismo usuario para el reclamo */
  async validateNoFeedbackDuplicado(reclamoId: string, clienteId: string) {
    const existente = await this.feedbackRepository.findByReclamoYCliente(
      reclamoId,
      clienteId,
    );

    if (existente) {
      throw new BadRequestException(
        `Ya existe un feedback para este reclamo hecho por este usuario`,
      );
    }
  }

  validateReclamoResuelto(reclamo: ReclamoDocumentType) {
    const ultimoHistorialEstado = reclamo.ultimoHistorialEstado as any; // Usamos 'any' para acceder a 'estado' sin problemas de tipado de Mongoose-populated

    if (
      !ultimoHistorialEstado ||
      ultimoHistorialEstado instanceof Types.ObjectId
    ) {
      throw new BadRequestException(
        'El reclamo no tiene un historial de estado o no está poblado completamente (último estado no poblado)',
      );
    }

    const estado = ultimoHistorialEstado.estado as any; // Usamos 'any' para acceder a 'nombre'

    if (!estado || estado instanceof Types.ObjectId) {
      throw new BadRequestException(
        'El último historial de estado no tiene un estado asociado o no está poblado (estado del historial no poblado)',
      );
    }

    // Finalmente, validamos el nombre del estado
    if (estado.nombre !== 'Resuelto') {
      throw new BadRequestException(
        `Solo se puede dejar feedback si el estado del reclamo es "Resuelto". El estado actual es: ${estado.nombre}`,
      );
    }
  }

  /** Validación completa */
  async validateCreateFeedback(
    reclamoId: string,
    clienteId: string,
  ): Promise<ReclamoDocumentType> {
    const reclamo = await this.validateReclamoExistente(reclamoId);
    await this.validateUsuarioExistente(clienteId);
    this.validateUsuarioEsCliente(reclamo, clienteId);
    this.validateReclamoResuelto(reclamo);
    await this.validateNoFeedbackDuplicado(reclamoId, clienteId);
    return reclamo;
  }
}
