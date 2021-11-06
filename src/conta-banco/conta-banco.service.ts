import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { CreateContaBancoDto } from './dto/create-conta-banco.dto';
import { UpdateContaBancoDto } from './dto/update-conta-banco.dto';
import { ReturnAccountBallanceDto } from './dto/account-balance.dto';
import { BankTransferDto } from './dto/bank-transfer.dto';

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

    const getContaBanco = await this.verifyContaBancoExists(titularId, bancoId);

    const { bancoInfos, titularInfos } = getContaBanco;

    try {
      const contaBanco = this.repository.create({
        titular: titularInfos,
        banco: bancoInfos,
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
    try {
      const getContaBanco = await this.repository.find({
        relations: ['titular', 'banco'],
      });

      return getContaBanco;
    } catch (error) {
      throw new BadRequestException('Não foi possível buscar a contaBanco');
    }
  }

  async findOne(id: string): Promise<ContaBanco> {
    try {
      const getContaBanco = await this.repository.findOne(id, {
        relations: ['titular', 'banco'],
      });

      return getContaBanco;
    } catch (error) {
      throw new BadRequestException('Não foi possível buscar a contaBanco');
    }
  }

  async update(id: string, updateContaBancoDto: UpdateContaBancoDto) {
    const { titularId, bancoId } = updateContaBancoDto;

    await this.verifyContaBancoExists(titularId, bancoId);

    const contaBanco = await this.repository.preload({
      id: id,
      ...updateContaBancoDto,
    });

    if (!contaBanco) throw new NotFoundException(`Item ${id} não encontrado`);

    return this.repository.save(contaBanco);
  }

  async remove(id: string) {
    try {
      const contaBanco = await this.findOne(id);

      return await this.repository.remove(contaBanco);
    } catch (error) {
      throw new BadRequestException('Não foi possível deletar a contaBanco');
    }
  }

  async getAccountBalance(id): Promise<ReturnAccountBallanceDto> {
    const getContaBanco = await this.repository.findOne(id, {
      relations: ['titular', 'banco'],
    });

    if (!getContaBanco)
      throw new BadRequestException('Não foi possível encontrar a contaBanco');

    return {
      titular: getContaBanco.titular,
      saldo: getContaBanco.saldo,
    };
  }

  async bankTransfer(bankTransferDto: BankTransferDto) {
    const { conta, agencia, digito, titularSenderId, valor } = bankTransferDto;

    const getRecipientContaBanco = await this.repository.findOne({
      relations: ['titular', 'banco'],
      where: {
        conta,
        digito,
        banco: {
          agencia,
        },
      },
    });

    if (!getRecipientContaBanco)
      throw new NotFoundException('ContaBanco do recebedor não encontrada');

    const verifyTitularSenderExists = await this.titularRepository.findOne({
      where: { id: titularSenderId },
    });

    if (!verifyTitularSenderExists)
      throw new NotFoundException('Titular Remetente não encontrado');

    const getSenderContaBanco = await this.repository.findOne({
      relations: ['titular', 'banco'],
      where: {
        titular: {
          id: titularSenderId,
        },
      },
    });

    if (!getSenderContaBanco)
      throw new NotFoundException('ContaBanco do titular não encontrada');

    const { saldo } = getSenderContaBanco;

    if (saldo === 0 || valor > saldo)
      throw new BadRequestException(
        'Transferência não realizada, verifique o seu saldo',
      );

    const updateRecipientContaBanco = await this.repository.preload({
      id: getRecipientContaBanco.id,
      saldo: (getRecipientContaBanco.saldo += valor),
      ...getRecipientContaBanco,
    });

    if (!updateRecipientContaBanco)
      throw new NotFoundException(
        'Não foi possível realizar a transferência, verifique seus dados',
      );

    await this.repository.save(updateRecipientContaBanco);

    const updateSenderContaBanco = await this.repository.preload({
      id: getSenderContaBanco.id,
      saldo: (getSenderContaBanco.saldo -= valor),
      ...getSenderContaBanco,
    });

    if (!updateSenderContaBanco)
      throw new NotFoundException(
        'Não foi possível realizar a transferência, verifique seus dados',
      );

    await this.repository.save(updateSenderContaBanco);

    return {
      message: 'Transferência realizada com sucesso',
    };
  }

  async verifyContaBancoExists(titularId: string, bancoId: string) {
    const getTitularInfo = await this.titularRepository.findOne(titularId);
    const getBancoInfo = await this.bancoRepository.findOne(bancoId);

    if (!getTitularInfo) throw new NotFoundException('Titular não encontrado');
    if (!getBancoInfo) throw new NotFoundException('Banco não encontrado');

    const getContaBanco = await this.repository.findOne({
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

    if (!getContaBanco)
      throw new BadRequestException('O Titular já possui conta nesse Banco');

    return {
      titularInfos: getTitularInfo,
      bancoInfos: getBancoInfo,
      contaBancoInfos: getContaBanco,
    };
  }
}
