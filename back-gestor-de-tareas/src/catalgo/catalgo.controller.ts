import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CatalogoService } from './catalgo.service';
import { CreateCatalogoDto } from './dto/create-catalgo.dto';
import { UpdateCatalogoDto } from './dto/update-catalgo.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('api/catalogo')
@UseGuards(JwtGuard)
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  @Post()
  create(@Body() createCatalogoDto: CreateCatalogoDto) {
    return this.catalogoService.create(createCatalogoDto);
  }

  @Get()
  findAll() {
    return this.catalogoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogoDto: UpdateCatalogoDto) {
    return this.catalogoService.update(id, updateCatalogoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catalogoService.remove(id);
  }
}
