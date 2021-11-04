import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BancoService } from './banco.service';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';

@Controller('banco')
export class BancoController {
  constructor(private readonly bancoService: BancoService) {}

  @Post()
  create(@Body() createBancoDto: CreateBancoDto) {
    return this.bancoService.create(createBancoDto);
  }

  @Get()
  findAll() {
    return this.bancoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bancoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBancoDto: UpdateBancoDto) {
    return this.bancoService.update(id, updateBancoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bancoService.remove(id);
  }
}
