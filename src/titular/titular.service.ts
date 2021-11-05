import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  async create(createTitularDto: CreateTitularDto) {
    const { cpf } = createTitularDto;

    await this.verifyTitularExists(cpf);

    try {
      const titular = await this.repository.create(createTitularDto);

      return this.repository.save(titular);
    } catch (error) {
      throw new BadRequestException(
        'Não foi possível criar um novo titular, verifique seus dados',
      );
    }
  }

  async findAll(): Promise<Titular[]> {
    try {
      const getTitular = await this.repository.find();

      return getTitular;
    } catch (error) {
      throw new BadRequestException('Não foi possível buscar os titulares');
    }
  }

  async findOne(id: string): Promise<Titular> {
    try {
      const getTitular = await this.repository.findOne(id);

      return getTitular;
    } catch (error) {
      throw new BadRequestException('Não foi possível buscar o titular');
    }
  }

  async update(
    id: string,
    updateTitularDto: UpdateTitularDto,
  ): Promise<Titular> {
    try {
      const { cpf } = updateTitularDto;

      await this.verifyTitularExists(cpf);

      const titular = await this.repository.preload({
        id: id,
        ...updateTitularDto,
      });

      if (!titular) throw new NotFoundException(`Item ${id} não encontrado`);

      return this.repository.save(titular);
    } catch (error) {
      throw new BadRequestException(
        'Não foi possível editar o titular, verifique os dados',
      );
    }
  }

  async remove(id: string) {
    try {
      const titular = await this.findOne(id);

      return this.repository.remove(titular);
    } catch (error) {
      throw new BadRequestException('Não foi possível deletar o titular');
    }
  }

  async verifyTitularExists(cpf: string) {
    const getTitular = await this.repository.findOne({
      where: { cpf },
    });

    if (getTitular)
      throw new BadRequestException('O Titular já possui conta nesse Banco');
  }
}
