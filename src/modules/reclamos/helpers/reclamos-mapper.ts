import { Injectable } from '@nestjs/common';
import { Reclamo, ReclamoDocumentType } from '../schemas/reclamo.schema';
import { ReclamoAsignadoDto } from '../dto/reclamo-asignado-dto';

@Injectable()
export class ReclamosMapper {
  /* TERMINAR CUANDO ESTE LO DE PROYECTO Y TODAS LAS RELACIONES CON RECLAMO
  toReclamosAsignadosDto(reclamos: ReclamoDocumentType[]): ReclamoAsignadoDto[] {
    //return reclamos.map((reclamo) => {
    
  }
  toReclamoAsignadoDto(reclamo: Reclamo): ReclamoAsignadoDto{
    return {
        reclamoId: String(reclamo._id),
        reclamoTitulo: reclamo.titulo,
        nombreProyecto: reclamo.proyecto,
        nombreApellidoCliente: reclamo.nombreApellidoCliente,
        fechaHoraInicioAsignacion: reclamo.fechaHoraInicioAsignacion,
        tipoAsignacion: reclamo.tipoAsignacion,
    }
         }
        */
}
