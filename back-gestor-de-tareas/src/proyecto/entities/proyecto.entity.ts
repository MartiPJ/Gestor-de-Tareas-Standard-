import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}export default Proyecto;
