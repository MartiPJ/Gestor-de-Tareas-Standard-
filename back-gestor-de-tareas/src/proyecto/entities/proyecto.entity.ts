import { Tarea } from "src/tareas/entities/tarea.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('proyecto')
export class Proyecto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 255 })
    descripcion: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    create_at: Date;

     // Relación: Un proyecto tiene muchas tareas
    @OneToMany(() => Tarea, (tarea) => tarea.proyecto)
    tareas: Tarea[];

}export default Proyecto;
