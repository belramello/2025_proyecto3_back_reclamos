import { Injectable } from '@nestjs/common';
import { ReclamoDocumentType } from '../schemas/reclamo.schema';
import { MailService } from 'src/modules/mail/mail.service';

@Injectable()
export class ReclamosHelper {
  private readonly caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  constructor(private readonly mailService: MailService) {}
  generarNroDeTicket(): string {
    let resultado = '';
    for (let i = 0; i < 4; i++) {
      const index = Math.floor(Math.random() * this.caracteres.length);
      resultado += this.caracteres[index];
    }
    return resultado;
  }

  async notificarCliente(
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
}
