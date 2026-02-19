import { Injectable } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import Tarea from './entities/tarea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
  ){}
  async create(createTareaDto: CreateTareaDto) {
  const tarea = this.tareaRepository.create({
    titulo: createTareaDto.titulo,
    descripcion: createTareaDto.descripcion,

    proyecto: { id: createTareaDto.proyecto_id },
    createdBy: { id: createTareaDto.created_by },
    assignedTo: { id: createTareaDto.assigned_to },
    catalogo: { id: createTareaDto.catalogo_id },
  })

  return await this.tareaRepository.save(tarea)
  }

  findAll() {
    return this.tareaRepository.find({
      relations: ['proyecto', 'createdBy', 'assignedTo', 'catalogo'],
    });
  }


  async findOne(id_tarea: string) {
    const record = await this.tareaRepository.findOne({
      where: { id: id_tarea },
      relations: ['proyecto', 'createdBy', 'assignedTo', 'catalogo'],
    });

    if(record === null){
      throw new Error(`Tarea with id ${id_tarea} not found`);
    }
    return record;
  }

  async findByTitulo(nombre: string): Promise<Tarea | null> {
    return this.tareaRepository.findOne({
      where: { titulo: nombre }
    });
  }


  async update(id_tarea: string, updateTarea: UpdateTareaDto) {
    const tarea = await this.findOne(id_tarea);
    this.tareaRepository.merge(tarea, updateTarea);
    return this.tareaRepository.save(tarea);
  }

  async remove(id_tarea: string) {
    const tarea = await this.findOne(id_tarea);
    return this.tareaRepository.remove(tarea);
  }
}