/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { Feedback } from '../schemas/feedbak.schema';
import { RespuestaCreateFeedbackDto } from '../dto/respuesta-create-feedback.dto';
import { RespuestaFeedbackDto } from '../dto/respuesta-feedback.dto';
import { RespuestaFindAllPaginatedFeedbackDTO } from '../dto/respuesta-find-all-paginated-dto';
import { Reclamo } from 'src/modules/reclamos/schemas/reclamo.schema';
import { Usuario } from 'src/modules/usuario/schema/usuario.schema';
import { Types } from 'mongoose';

@Injectable()
export class FeedbackMapper {
  constructor() {}

  // --- CREATE ---
  toRespuestaCreateFeedback(feedback: Feedback): RespuestaCreateFeedbackDto {
    return {
      valoracion: feedback.valoracion,
      comentario: feedback.comentario,
      reclamo: this.mapReclamo(feedback.reclamo),
      cliente: this.mapUsuario(feedback.cliente),
      fechaCreacion: feedback.fechaCreacion,
    };
  }

  // --- SINGLE FEEDBACK DTO ---
  toRespuestaFeedbackDto(feedback: Feedback): RespuestaFeedbackDto {
    return {
      valoracion: feedback.valoracion,
      comentario: feedback.comentario,
      reclamo: this.mapReclamo(feedback.reclamo),
      cliente: this.mapUsuario(feedback.cliente),
      fechaCreacion: feedback.fechaCreacion,
    };
  }

  // --- FIND ALL ---
  toRespuestaFindAllFeedbackDto(
    feedbackList: Feedback[],
  ): RespuestaFeedbackDto[] {
    return feedbackList.map((f) => this.toRespuestaFeedbackDto(f));
  }

  // --- PAGINATED ---
  toRespuestaFindAllPaginatedFeedbackDto(paginated: {
    feedback: Feedback[];
    total: number;
    page: number;
    lastPage: number;
  }): RespuestaFindAllPaginatedFeedbackDTO {
    return {
      feedback: this.toRespuestaFindAllFeedbackDto(paginated.feedback),
      total: paginated.total,
      page: paginated.page,
      lastPage: paginated.lastPage,
    };
  }

  // ---------- HELPERS ----------
  private mapReclamo(reclamo: Reclamo | Types.ObjectId | null | undefined) {
    if (!reclamo || reclamo instanceof Types.ObjectId) return null;

    return {
      nroTicket: reclamo.nroTicket,
      descripcion: reclamo.descripcion,
      ultimoHistorialEstado: reclamo.ultimoHistorialEstado,
    };
  }

  private mapUsuario(cliente: Usuario | Types.ObjectId | null | undefined) {
    if (!cliente || cliente instanceof Types.ObjectId) return null;

    return {
      nombre: cliente.nombre,
      email: cliente.email,
    };
  }
}
