import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt'
import { Tarea } from "src/tareas/entities/tarea.entity";


export enum EstadoRol {
    ADMIN = 'admin',
    designer = 'diseñador',
    developer = 'desarrollador',
}

@Entity('usuario')
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column('varchar', { length: 150, unique: true })
    email: string;

    @Column({
        type: 'enum',
        enum: EstadoRol,
        default: EstadoRol.ADMIN,
    })
    role: EstadoRol;

    @Column({type:'varchar', default:''})
    password:string;


    // Relación: Un usuario puede crear muchas tareas
    @OneToMany(() => Tarea, (tarea) => tarea.createdBy)
    tareasCreadas: Tarea[];

    // Relación: Un usuario puede tener muchas tareas asignadas
    @OneToMany(() => Tarea, (tarea) => tarea.assignedTo)
    tareasAsignadas: Tarea[];

    @BeforeInsert()
    async hashPassword() {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(this.password, saltOrRounds);
        this.password = hash;
    }
}export default Usuario;
