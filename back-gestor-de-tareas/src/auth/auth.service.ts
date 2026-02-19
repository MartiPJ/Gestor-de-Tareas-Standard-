import { Injectable, UnauthorizedException } from "@nestjs/common";
import Usuario from "src/usuario/entities/usuario.entity";
import { UsuarioService } from "src/usuario/usuario.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly usuarioService: UsuarioService) {}

    async signIn(email: string, password: string): Promise<Partial<Usuario>> { 
        const usuario = await this.usuarioService.findByEmail(email);
        
        if (!usuario) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        const isMatch = await bcrypt.compare(password, usuario.password);

        if (!isMatch) {
            throw new UnauthorizedException('Contraseña incorrecta');
        }

        // Excluir password del objeto retornado
        const { password: _, ...resultado } = usuario;
        return resultado; // Retorna usuario sin password
    }
}