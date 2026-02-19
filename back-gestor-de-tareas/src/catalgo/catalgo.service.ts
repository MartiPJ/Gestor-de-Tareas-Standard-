import { Injectable } from '@nestjs/common';
import { CreateCatalogoDto } from './dto/create-catalgo.dto';
import { UpdateCatalogoDto } from './dto/update-catalgo.dto';
import { Catalogo, EstatusProyecto } from './entities/catalgo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class CatalogoService {
  constructor(
    @InjectRepository(Catalogo)
    private readonly catalogoRepository: Repository<Catalogo>,
  ){}
  create(createCatalogoDto: CreateCatalogoDto) {
    const catalogo = this.catalogoRepository.create(createCatalogoDto);
    return this.catalogoRepository.save(catalogo);
  }

  findAll() {
    return this.catalogoRepository.find();
  }

  async findOne(id_catalogo: string) {
    const record = await this.catalogoRepository.findOne({ 
      where: { id: id_catalogo },
    });

    if(record === null){
      throw new Error(`Catalogo with id ${id_catalogo} not found`);
    }
    return record;
  }

  async findByStatus(Estado: EstatusProyecto): Promise<Catalogo[]> {
    return this.catalogoRepository.find({
      where: { Estado }
    });
  }


  async update(id_catalogo: string, updateCatalogo: UpdateCatalogoDto) {
    const catalogo = await this.findOne(id_catalogo);
    this.catalogoRepository.merge(catalogo, updateCatalogo);
    return this.catalogoRepository.save(catalogo);
  }

  async remove(id_catalogo: string) {
    const catalogo = await this.findOne(id_catalogo);
    return this.catalogoRepository.remove(catalogo);
  }
}