import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

import { Proyecto } from 'src/proyecto/entities/proyecto.entity'
import { Usuario } from 'src/usuario/entities/usuario.entity'
import { Catalogo } from 'src/catalgo/entities/catalgo.entity'
import e from 'express';


@Entity('tarea')
export class Tarea {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 200 })
    titulo: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    // 🔹 Proyecto (Many-to-One)
    @ManyToOne(() => Proyecto, (proyecto) => proyecto.tareas, {
        onDelete: 'CASCADE',
        nullable: false
    })
    @JoinColumn({ name: 'proyecto_id' })
    proyecto: Proyecto;  // Cambié de mayúscula a minúscula (convención)

    // 🔹 Usuario que creó la tarea (Many-to-One)
    @ManyToOne(() => Usuario, (usuario) => usuario.tareasCreadas, {
        nullable: false
    })
    @JoinColumn({ name: 'created_by' })
    createdBy: Usuario;

    // 🔹 Usuario asignado (Many-to-One)
    @ManyToOne(() => Usuario, (usuario) => usuario.tareasAsignadas, {
        nullable: true
    })
    @JoinColumn({ name: 'assigned_to' })
    assignedTo: Usuario;

    // 🔹 Estado (Many-to-One)
    @ManyToOne(() => Catalogo, (catalogo) => catalogo.tareas, {
        nullable: false
    })
    @JoinColumn({ name: 'catalogo_id' })
    catalogo: Catalogo;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
} export default Tarea;