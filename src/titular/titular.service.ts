import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTitularDto } from './dto/create-titular.dto';
import { UpdateTitularDto } from './dto/update-titular.dto';
import { Repository } from 'typeorm';
import { Titular } from '../titular/entities/titular.entity';

@Injectable()
export class TitularService {
  constructor(
    @InjectRepository(Titular) private readonly repository: Repository<Titular>,
  ) {}

  create(createTitularDto: CreateTitularDto) {
    const titular = this.repository.create(createTitularDto);

    return this.repository.save(titular);
  }

  findAll(): Promise<Titular[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<Titular> {
    return this.repository.findOne(id);
  }

  async update(
    id: string,
    updateTitularDto: UpdateTitularDto,
  ): Promise<Titular> {
    const titular = await this.repository.preload({
      id: id,
      ...updateTitularDto,
    });

    if (!titular) throw new NotFoundException(`Item ${id} não encontrado`);

    return this.repository.save(titular);
  }

  async remove(id: string) {
    const titular = await this.findOne(id);

    return this.repository.remove(titular);
  }
}
