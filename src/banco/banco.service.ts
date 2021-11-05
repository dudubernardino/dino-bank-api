import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
import { Like, Repository } from 'typeorm';
import { Banco } from '../banco/entities/banco.entity';

@Injectable()
export class BancoService {
  constructor(
    @InjectRepository(Banco) private readonly repository: Repository<Banco>,
  ) {}

  async create(createBancoDto: CreateBancoDto) {
    const { codigo, agencia } = createBancoDto;

    await this.verifyBancoExists(codigo, agencia);

    try {
      const banco = await this.repository.create(createBancoDto);

      return this.repository.save(banco);
    } catch (error) {
      throw new BadRequestException(
        'Não foi possível criar um novo banco, verifique seus dados',
      );
    }
  }

  async findAll(): Promise<Banco[]> {
    try {
      const getBanco = await this.repository.find();

      return getBanco;
    } catch (error) {
      throw new BadRequestException('Não foi possível buscar os bancos');
    }
  }

  async findOne(id: string): Promise<Banco> {
    try {
      const getBanco = await this.repository.findOne(id);

      return getBanco;
    } catch (error) {
      throw new BadRequestException('Não foi possível buscar os bancos');
    }
  }

  async update(id: string, updateBancoDto: UpdateBancoDto): Promise<Banco> {
    try {
      const { codigo, agencia } = updateBancoDto;

      await this.verifyBancoExists(codigo, agencia);

      const banco = await this.repository.preload({
        id: id,
        ...updateBancoDto,
      });

      if (!banco) throw new NotFoundException(`Item ${id} não encontrado`);

      return this.repository.save(banco);
    } catch (error) {
      throw new BadRequestException(
        'Não foi possível editar o banco, verifique os dados',
      );
    }
  }

  async remove(id: string) {
    try {
      const banco = await this.findOne(id);

      return this.repository.remove(banco);
    } catch (error) {
      throw new BadRequestException('Não foi possível deletar o banco');
    }
  }

  async verifyBancoExists(codigo: string, agencia: string) {
    const getBanco = await this.repository.findOne({
      where: [
        { codigo: Like(`%${codigo}%`) },
        { agencia: Like(`%${agencia}%`) },
      ],
    });

    if (getBanco) throw new BadRequestException('O Banco já foi cadastrado');
  }
}
