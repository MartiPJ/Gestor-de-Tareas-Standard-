import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { CatalogoModule } from './catalgo/catalgo.module';
import { TareasModule } from './tareas/tareas.module';
import * as joi from 'joi';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:'.env',
      validationSchema:joi.object({
        DB_HOST: joi.string().required(),
        DB_PORT: joi.number().default(5432),
        DB_NAME: joi.string().required(),
        DB_USER: joi.string().required(),
        DB_PASSWORD: joi.string().required(),
        
      })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, // nombre del servicio en docker-compose
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // solo en desarrollo
    }),
    UsuarioModule,
    ProyectoModule,
    CatalogoModule,
    TareasModule,
    AuthModule  
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

