import { Module } from '@nestjs/common';
import { CatalogoService } from './catalgo.service';
import { CatalogoController } from './catalgo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalogo } from './entities/catalgo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Catalogo])],
  controllers: [CatalogoController],
  providers: [CatalogoService],
  exports: [CatalogoService],
})
export class CatalogoModule {}
