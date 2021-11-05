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

  async create(createBancoDto: CreateBancoDto) {
    const banco = await this.repository.create(createBancoDto);

    return this.repository.save(banco);
  }

  async findAll(): Promise<Banco[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<Banco> {
    return await this.repository.findOne(id);
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
