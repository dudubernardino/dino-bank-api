import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContaBancoDto } from './dto/create-conta-banco.dto';
import { UpdateContaBancoDto } from './dto/update-conta-banco.dto';
import { Repository } from 'typeorm';
import { ContaBanco } from './entities/conta-banco.entity';

@Injectable()
export class ContaBancoService {
  constructor(
    @InjectRepository(ContaBanco)
    private readonly repository: Repository<ContaBanco>,
  ) {}

  create(createContaBancoDto: CreateContaBancoDto) {
    const contaBanco = this.repository.create(createContaBancoDto);

    return this.repository.save(contaBanco);
  }

  findAll(): Promise<ContaBanco[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<ContaBanco> {
    return this.repository.findOne(id);
  }

  async update(id: string, updateContaBancoDto: UpdateContaBancoDto) {
    const contaBanco = await this.repository.preload({
      id: id,
      ...updateContaBancoDto,
    });

    if (!contaBanco) throw new NotFoundException(`Item ${id} não encontrado`);

    return this.repository.save(contaBanco);
  }

  async remove(id: string) {
    const contaBanco = await this.findOne(id);

    return this.repository.remove(contaBanco);
  }
}
