import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TitularService } from './titular.service';
import { CreateTitularDto } from './dto/create-titular.dto';
import { UpdateTitularDto } from './dto/update-titular.dto';

@Controller('titular')
export class TitularController {
  constructor(private readonly titularService: TitularService) {}

  @Post()
  create(@Body() createTitularDto: CreateTitularDto) {
    return this.titularService.create(createTitularDto);
  }

  @Get()
  findAll() {
    return this.titularService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.titularService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTitularDto: UpdateTitularDto) {
    return this.titularService.update(id, updateTitularDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.titularService.remove(id);
  }
}
