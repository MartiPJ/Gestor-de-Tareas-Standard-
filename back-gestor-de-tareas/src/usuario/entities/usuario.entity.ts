import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt'

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

    @BeforeInsert()
    async hashPassword() {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(this.password, saltOrRounds);
        this.password = hash;
    }
}export default Usuario;
