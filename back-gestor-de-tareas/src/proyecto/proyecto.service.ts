import { Injectable } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Proyecto } from './entities/proyecto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
  ){}
  create(createProyectoDto: CreateProyectoDto) {
    const proyecto = this.proyectoRepository.create(createProyectoDto);
    return this.proyectoRepository.save(proyecto);
  }

  findAll() {
    return this.proyectoRepository.find();
  }

  async findOne(id_proyecto: string) {
    const record = await this.proyectoRepository.findOne({ 
      where: { id: id_proyecto },
    });

    if(record === null){
      throw new Error(`Proyecto with id ${id_proyecto} not found`);
    }
    return record;
  }

  async findByNombre(nombre: string): Promise<Proyecto | null> {
    return this.proyectoRepository.findOne({
      where: { nombre }
    });
  }


  async update(id_proyecto: string, updateProyecto: UpdateProyectoDto) {
    const proyecto = await this.findOne(id_proyecto);
    this.proyectoRepository.merge(proyecto, updateProyecto);
    return this.proyectoRepository.save(proyecto);
  }

  async remove(id_proyecto: string) {
    const proyecto = await this.findOne(id_proyecto);
    return this.proyectoRepository.remove(proyecto);
  }
}
