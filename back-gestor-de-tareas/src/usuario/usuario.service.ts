import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Usuario from './entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ){}
  create(createUsuarioDto: CreateUsuarioDto) {
    const usuario = this.usuarioRepository.create(createUsuarioDto);
    return this.usuarioRepository.save(usuario);
  }

  findAll() {
    return this.usuarioRepository.find();
  }

  async findOne(id_usuario: string) {
    const record = await this.usuarioRepository.findOne({ 
      where: { id: id_usuario },
    });

    if(record === null){
      throw new Error(`Usuario with id ${id_usuario} not found`);
    }
    return record;
  }

  async findByNombre(nombre: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: { nombre }
    });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: { email }
    });
  }


  async update(id_usuario: string, updateUsuario: UpdateUsuarioDto) {
    const usuario = await this.findOne(id_usuario);
    this.usuarioRepository.merge(usuario, updateUsuario);
    return this.usuarioRepository.save(usuario);
  }

  async remove(id_usuario: string) {
    const usuario = await this.findOne(id_usuario);
    return this.usuarioRepository.remove(usuario);
  }
}
