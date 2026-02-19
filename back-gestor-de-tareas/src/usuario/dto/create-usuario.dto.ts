import { EstadoRol } from "../entities/usuario.entity";

export class CreateUsuarioDto {
    nombre:string;
    email:string;
    role:EstadoRol;
    password:string;
}
