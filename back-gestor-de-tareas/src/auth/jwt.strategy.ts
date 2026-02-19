import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioService } from "src/usuario/usuario.service";
import { ConfigService } from "@nestjs/config";

type Payload = {
    sub: string;
    nombre: string;
    iat: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly configService: ConfigService
    ) {
        const secret = configService.get<string>('JWT_SECRET');
        
        if (!secret) {
            throw new Error('JWT_SECRET no está definido en las variables de entorno');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: Payload) {
        try {
            const usuario = await this.usuarioService.findOne(payload.sub);
            return usuario;
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}