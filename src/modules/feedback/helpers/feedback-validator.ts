/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ReclamosService } from 'src/modules/reclamos/reclamos.service';
import { UsuarioService } from 'src/modules/usuario/usuario.service';
import { Types } from 'mongoose';
import type { IFeedbackRepository } from '../repository/feedback-repository.interface';

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

  /** Validación completa */
  async validateCreateFeedback(reclamoId: string, clienteId: string) {
    const reclamo = await this.validateReclamoExistente(reclamoId);
    await this.validateUsuarioExistente(clienteId);
    this.validateUsuarioEsCliente(reclamo, clienteId);
    await this.validateNoFeedbackDuplicado(reclamoId, clienteId);

    return reclamo;
  }
}
