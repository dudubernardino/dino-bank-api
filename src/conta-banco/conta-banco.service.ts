import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContaBancoDto } from './dto/create-conta-banco.dto';
import { UpdateContaBancoDto } from './dto/update-conta-banco.dto';
import { Repository } from 'typeorm';

import { ContaBanco } from './entities/conta-banco.entity';
import { Titular } from '../titular/entities/titular.entity';
import { Banco } from '../banco/entities/banco.entity';

@Injectable()
export class ContaBancoService {
  constructor(
    @InjectRepository(ContaBanco)
    private readonly repository: Repository<ContaBanco>,

    @InjectRepository(Titular)
    private readonly titularRepository: Repository<Titular>,

    @InjectRepository(Banco)
    private readonly bancoRepository: Repository<Banco>,
  ) {}

  async create(createContaBancoDto: CreateContaBancoDto) {
    const { titularId, bancoId } = createContaBancoDto;

    const getTitularInfo = await this.titularRepository.findOne(titularId);
    const getBancoInfo = await this.bancoRepository.findOne(bancoId);

    if (!getTitularInfo) throw new NotFoundException('Titular não encontrado');
    if (!getBancoInfo) throw new NotFoundException('Banco não encontrado');

    const getContaBanco = await this.repository.find({
      relations: ['titular', 'banco'],
      where: {
        titular: {
          id: titularId,
        },
        banco: {
          id: bancoId,
        },
      },
    });

    if (!!getContaBanco.length)
      throw new BadRequestException('O Titular já possui conta nesse Banco');

    try {
      const contaBanco = this.repository.create({
        titular: getTitularInfo,
        banco: getBancoInfo,
        ...createContaBancoDto,
      });

      return this.repository.save(contaBanco);
    } catch (error) {
      throw new BadRequestException(
        'Não foi possível criar a conta no banco, verifique seus dados',
      );
    }
  }

  async findAll(): Promise<ContaBanco[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<ContaBanco> {
    return await this.repository.findOne(id);
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
