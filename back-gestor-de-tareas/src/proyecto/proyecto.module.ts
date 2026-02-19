import { Module } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { Proyecto } from './entities/proyecto.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto])],
  controllers: [ProyectoController],
  providers: [ProyectoService],
  exports: [ProyectoService],
})
export class ProyectoModule {}
