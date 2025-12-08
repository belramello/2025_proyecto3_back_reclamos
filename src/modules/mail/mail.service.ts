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
    // Ajusta el puerto 5173 si tu frontend corre en otro lado
    const url = `http://localhost:5173/auth/activar-cuenta?token=${token}`;
    
    // Importamos el template
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
}