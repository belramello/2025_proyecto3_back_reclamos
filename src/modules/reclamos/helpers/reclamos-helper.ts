import { Injectable } from '@nestjs/common';

@Injectable()
export class ReclamosHelper {
  private readonly caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  generarNroDeTicket(): string {
    let resultado = '';
    for (let i = 0; i < 4; i++) {
      const index = Math.floor(Math.random() * this.caracteres.length);
      resultado += this.caracteres[index];
    }
    return resultado;
  }
}
