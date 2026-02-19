import { Module } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { TareasController } from './tareas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarea } from './entities/tarea.entity';
import { Catalogo } from 'src/catalgo/entities/catalgo.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Proyecto } from 'src/proyecto/entities/proyecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea,
    Proyecto,
    Usuario,
    Catalogo])], 
  controllers: [TareasController],
  providers: [TareasService],
  exports: [TareasService], 
})
export class TareasModule {}
