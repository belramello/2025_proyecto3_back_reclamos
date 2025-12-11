import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendUserActivation(email: string, token: string, rol: string) {
    const url = `http://localhost:5173/auth/activar-cuenta?token=${token}`;
    const { getWelcomeTemplate } = require('./templates/user-welcome.template');
    const html = getWelcomeTemplate(rol, url);

    try {
      await this.transporter.sendMail({
        from: `"Gestión de Reclamos" <${this.configService.get<string>('MAIL_USER')}>`,
        to: email,
        subject: 'Bienvenido - Activa tu cuenta',
        html: html,
      });
      console.log(`Mail enviado a: ${email}`);
    } catch (error) {
      console.error('Error enviando mail:', error);
    }
  }

  // --- NUEVO MÉTODO AGREGADO ---
  async sendReclamoNotification(
    email: string,
    nroTicket: string,
    titulo: string,
    nuevoEstado: string,
    mensaje: string
  ) {
    const { getNotificacionReclamoTemplate } = require('./templates/notificacion-reclamo.template');
    const html = getNotificacionReclamoTemplate(nroTicket, titulo, nuevoEstado, mensaje);

    try {
      await this.transporter.sendMail({
        from: `"Gestión de Reclamos" <${this.configService.get<string>('MAIL_USER')}>`,
        to: email,
        subject: `Actualización Reclamo #${nroTicket}`,
        html: html,
      });
      console.log(`📧 Notificación de reclamo enviada a: ${email}`);
    } catch (error) {
      console.error('❌ Error enviando notificación de reclamo:', error);
    }
  }


    async enviarNotificacionCreacionReclamo(email: string,nroTicket: string,titulo: string,fechaCreacion: Date,) {
    const { getTicketCreationTemplate } = require('./templates/creacion-reclamo.template');

    const fechaFormateada = fechaCreacion.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const html = getTicketCreationTemplate(nroTicket, titulo, fechaFormateada);

    try {
      await this.transporter.sendMail({
        from: `"Gestión de Reclamos" <${this.configService.get<string>('MAIL_USER')}>`,
        to: email,
        subject: `Nuevo reclamo registrado - Ticket #${nroTicket}`,
        html: html,
      });

    } catch (error) {
    }
  }

}