import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { getResetPasswordTemplate } from './templates/resetear-contraseña.template';

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
    const url = `${this.configService.get<string>('FRONTEND_URL')}/auth/activar-cuenta?token=${token}`;
    const { getWelcomeTemplate } = require('./templates/user-welcome.template');
    const html = getWelcomeTemplate(rol, url);

    try {
      await this.transporter.sendMail({
        from: `"Gestión de Reclamos" <${this.configService.get<string>('MAIL_USER')}>`,
        to: email,
        subject: 'Bienvenido - Activa tu cuenta',
        html,
      });
    } catch (error) {
      console.error('Error enviando mail:', error);
    }
  }

  async sendReclamoNotification(
    email: string,
    nroTicket: string,
    titulo: string,
    nuevoEstado: string,
    mensaje: string,
  ) {
    const {
      getNotificacionReclamoTemplate,
    } = require('./templates/notificacion-reclamo.template');
    const html = getNotificacionReclamoTemplate(
      nroTicket,
      titulo,
      nuevoEstado,
      mensaje,
    );

    try {
      await this.transporter.sendMail({
        from: `"Gestión de Reclamos" <${this.configService.get<string>('MAIL_USER')}>`,
        to: email,
        subject: `Actualización Reclamo #${nroTicket}`,
        html,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error enviando notificación de cambio de estado',
      );
    }
  }

  async enviarNotificacionCreacionReclamo(
    email: string,
    nroTicket: string,
    titulo: string,
    fechaCreacion: Date,
  ) {
    const {
      getTicketCreationTemplate,
    } = require('./templates/creacion-reclamo.template');

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
        subject: `Nuevo reclamo creado - Ticket #${nroTicket}`,
        html,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error enviando notificación de creación',
      );
    }
  }

  async sendAsignacionEmpleado(email: string, nroTicket: string) {
    const {
      getAsignaciionEmpleadoTemplate,
    } = require('./templates/asignacion-empleado.template');
    const html = getAsignaciionEmpleadoTemplate(nroTicket);

    try {
      await this.transporter.sendMail({
        from: `"Gestión de Reclamos" <${this.configService.get<string>('MAIL_USER')}>`,
        to: email,
        subject: `Asignación de Reclamo #${nroTicket}`,
        html,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error enviando notificación de asignación',
      );
    }
  }

  async sendPasswordReset(email: string, nombre: string, resetUrl: string) {
    const html = getResetPasswordTemplate(nombre, resetUrl);

    try {
      await this.transporter.sendMail({
        from: `"Gestión de Reclamos" <${this.configService.get<string>('MAIL_USER')}>`,
        to: email,
        subject: 'Recuperación de Contraseña - Gestión de Reclamos',
        html,
      });
    } catch (error) {
      console.error('Error enviando mail de reseteo de contraseña:', error);
      throw new InternalServerErrorException(
        'Error enviando mail de reseteo de contraseña',
      );
    }
  }
}
