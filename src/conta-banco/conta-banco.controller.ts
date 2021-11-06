import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContaBancoService } from './conta-banco.service';
import { BankTransferDto } from './dto/bank-transfer.dto';
import { CreateContaBancoDto } from './dto/create-conta-banco.dto';
import { GenerateBilletDto } from './dto/generate-billet.dto';
import { UpdateContaBancoDto } from './dto/update-conta-banco.dto';
import { VerifyBilletDto } from './dto/verify-billet.dto';

@Controller('conta-banco')
export class ContaBancoController {
  constructor(private readonly contaBancoService: ContaBancoService) {}

  @Post()
  create(@Body() createContaBancoDto: CreateContaBancoDto) {
    return this.contaBancoService.create(createContaBancoDto);
  }

  @Get()
  findAll() {
    return this.contaBancoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contaBancoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContaBancoDto: UpdateContaBancoDto,
  ) {
    return this.contaBancoService.update(id, updateContaBancoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contaBancoService.remove(id);
  }

  @Get('/accountBalance/:id')
  getAccountBalance(@Param('id') id: string) {
    return this.contaBancoService.getAccountBalance(id);
  }

  @Post('/transferencia')
  bankTransfer(@Body() bankTransferDto: BankTransferDto) {
    return this.contaBancoService.bankTransfer(bankTransferDto);
  }

  @Post('/boleto')
  generateBillet(@Body() generateBilletDto: GenerateBilletDto) {
    return this.contaBancoService.generateBillet(generateBilletDto);
  }

  @Post('/boleto/validar')
  verifyBillet(@Body() verifyBilletDto: VerifyBilletDto) {
    return this.contaBancoService.verifyBillet(verifyBilletDto);
  }
}
