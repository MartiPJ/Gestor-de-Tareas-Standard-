import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LocalGuard } from "./local.guard";
import Usuario from "src/usuario/entities/usuario.entity";
import type { Request } from "express";
import { IsPublic } from 'src/common/is-public.decorator';

@Controller('api/auth/')
export class AuthController {
    constructor(private readonly jwtService: JwtService) { }

    @Post('login')
    @IsPublic()
    @UseGuards(LocalGuard)
    async login(@Req() request: Request) {
        const usuario = request.user as Usuario;
        const payload = {
            sub: usuario.id,   // 👈 usa el ID
            email: usuario.email,
            name: usuario.nombre,
        };

        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken: accessToken,
            user: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
            }
        }
    }
}