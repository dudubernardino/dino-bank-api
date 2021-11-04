import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
import { Repository } from 'typeorm';
import { Banco } from '../banco/entities/banco.entity';

@Injectable()
export class BancoService {
  constructor(
    @InjectRepository(Banco) private readonly repository: Repository<Banco>,
  ) {}

  create(createBancoDto: CreateBancoDto) {
    const banco = this.repository.create(createBancoDto);

    return this.repository.save(banco);
  }

  findAll(): Promise<Banco[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<Banco> {
    return this.repository.findOne(id);
  }

  async update(id: string, updateBancoDto: UpdateBancoDto): Promise<Banco> {
    const banco = await this.repository.preload({
      id: id,
      ...updateBancoDto,
    });

    if (!banco) throw new NotFoundException(`Item ${id} não encontrado`);

    return this.repository.save(banco);
  }

  async remove(id: string) {
    const banco = await this.findOne(id);

    return this.repository.remove(banco);
  }
}
