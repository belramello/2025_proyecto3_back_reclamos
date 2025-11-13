import { NivelCriticidad } from 'src/modules/nivel-criticidad/entities/nivel-criticidad.entity';
import { Prioridad } from 'src/modules/prioridad/entities/prioridad.entity';
import { TipoReclamo } from 'src/modules/tipo-reclamo/entities/tipo-reclamo.entity';
import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';

@Entity('reclamos')
export class Reclamo {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  nroTicket: string;

  @ManyToOne((()=>TipoReclamo),(TipoReclamo)=>TipoReclamo.reclamos)
  tipoReclamo: TipoReclamo;

  @ManyToOne((()=>Prioridad),(Prioridad)=>Prioridad.reclamos)
  prioridad: Prioridad;

  @ManyToOne((()=>NivelCriticidad),(NivelCriticidad)=>NivelCriticidad.reclamos)
  nivelCriticidad: NivelCriticidad;

  @Column()
  proyecto:number; //reemplazar por la entidad proyecto cuando este creada
  
  @Column()
  descripcion: string;

  @Column()
  imagenUrl: string;

  @Column()
  resumenResolucion: string;

  @CreateDateColumn()
  fechaCreacion: Date;
 
  @DeleteDateColumn({ nullable: true })
  fechaEliminacion: Date;
}
