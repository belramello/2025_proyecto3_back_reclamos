import { Proyecto } from "src/modules/proyectos/schemas/proyecto.schema";
import { TipoReclamo } from "src/modules/tipo-reclamo/schemas/tipo-reclamo.schema";

export class ReclamoResponseDto {
  nroTicket: string;           
  titulo: string;
  tipoReclamo?: TipoReclamo | undefined;
  prioridad: string;
  nivelCriticidad: number;
  proyecto: Proyecto | undefined;
  descripcion?: string;
  imagenUrl?: string[];
  resumenResolucion?: string;

}
