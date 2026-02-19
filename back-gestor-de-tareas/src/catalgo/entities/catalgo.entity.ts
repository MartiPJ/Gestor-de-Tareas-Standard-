import { Tarea } from "src/tareas/entities/tarea.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
export enum EstatusProyecto {
    Pending = 'pendiente',
    InProgress = 'en progreso',
    Completed = 'completado',
}
@Entity('catalogo')
export class Catalogo {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @Column({ type: 'varchar', length: 100 })
    Estado:EstatusProyecto;

    // Relación: Un estado puede estar en muchas tareas
    @OneToMany(() => Tarea, (tarea) => tarea.catalogo)
    tareas: Tarea[];

}export default Catalogo;
