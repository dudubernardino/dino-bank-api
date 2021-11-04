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
import { CreateContaBancoDto } from './dto/create-conta-banco.dto';
import { UpdateContaBancoDto } from './dto/update-conta-banco.dto';

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
}
