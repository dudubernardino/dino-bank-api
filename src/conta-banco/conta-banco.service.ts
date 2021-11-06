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
import { GenerateBilletDto } from './dto/generate-billet.dto';

import { Repository } from 'typeorm';

import { ContaBanco } from './entities/conta-banco.entity';
import { Titular } from '../titular/entities/titular.entity';
import { Banco } from '../banco/entities/banco.entity';

import { differenceInDays, addDays } from 'date-fns';

import * as bcrypt from 'bcrypt';
import { VerifyBilletDto } from './dto/verify-billet.dto';

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

  async generateBillet(generateBilletDto: GenerateBilletDto) {
    const { codigo, agencia, titularSenderId, valor } = generateBilletDto;

    const getBanco = await this.bancoRepository.findOne({
      where: {
        codigo,
        agencia,
      },
    });

    if (!getBanco) throw new NotFoundException('O Banco não foi encontrado');

    const getTitularSender = await this.titularRepository.findOne({
      where: { id: titularSenderId },
    });

    if (!getTitularSender)
      throw new NotFoundException('Titular Remetende não encontrado');

    const cryptData = await this.encryptData({
      codigo,
      agencia,
    });

    const digitoVerificador = cryptData ? '1' : '0';
    const dataVencimento = addDays(new Date(), 3);
    const dataEstipulada = new Date(1997, 9, 7);
    const numeroDias = differenceInDays(dataVencimento, dataEstipulada);
    const valorTotal = this.addPrefixToValor(valor);

    const linhaDigitavelBillet = `${codigo}.9.${cryptData}.${digitoVerificador}.${numeroDias}.${valorTotal}`;

    return {
      linhaDigitavel: linhaDigitavelBillet,
    };
  }

  async verifyBillet(verifyBilletDto: VerifyBilletDto) {
    const { linhaDigitavel } = verifyBilletDto;

    const getValuesFromData = linhaDigitavel.split('.');

    const codigo = getValuesFromData[0];
    const hashData = getValuesFromData[2];
    const digitoVerificador = Number(getValuesFromData[3]);

    const getBanco = await this.bancoRepository.findOne({
      where: {
        codigo,
      },
    });

    if (!getBanco)
      throw new NotFoundException(
        'Boleto inválidos, os dados estão incorretos',
      );

    const isDataValid = await this.decryptData(
      { codigo, agencia: getBanco.agencia },
      hashData,
    );

    if (!isDataValid)
      throw new NotFoundException(
        'Boleto inválidos, os dados estão incorretos',
      );

    if (!digitoVerificador)
      throw new NotFoundException(
        'Boleto inválidos, os dados estão incorretos',
      );

    return {
      message: 'O Boleto é válido',
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

  async encryptData(data: any) {
    const saltOrRounds = 8;

    const hash = await bcrypt.hash(JSON.stringify(data), saltOrRounds);

    return hash;
  }

  async decryptData(data: any, hash: string) {
    const isMatch = await bcrypt.compare(JSON.stringify(data), hash);

    return isMatch;
  }

  addPrefixToValor(valor: number) {
    let finalValor = valor + '';
    while (finalValor.length < 10) finalValor = '0' + finalValor;
    return finalValor;
  }
}
