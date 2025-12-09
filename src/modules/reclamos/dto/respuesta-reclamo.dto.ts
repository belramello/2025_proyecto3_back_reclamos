export class ReclamoResponseDto {
  nroTicket: string;           
  titulo: string;
  tipoReclamo?: string;
  prioridad: string;
  nivelCriticidad: number;
  proyecto: string;
  descripcion?: string;
  imagenUrl?: string[];
  resumenResolucion?: string;

}
