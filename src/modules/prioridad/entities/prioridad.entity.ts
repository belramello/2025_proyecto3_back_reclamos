import { Column, Entity, ObjectId, ObjectIdColumn, OneToMany } from "typeorm";
import { Reclamo } from "src/modules/reclamos/entities/reclamo.entity";
@Entity('prioridad')
export class Prioridad {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    nombre: string;

    @OneToMany(()=>Reclamo,(reclamo)=>reclamo.id)
    reclamos:Reclamo[];
    
}
