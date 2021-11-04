import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContaBancoService } from './conta-banco.service';
import { ContaBancoController } from './conta-banco.controller';
import { ContaBanco } from './entities/conta-banco.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContaBanco])],
  controllers: [ContaBancoController],
  providers: [ContaBancoService],
})
export class ContaBancoModule {}
