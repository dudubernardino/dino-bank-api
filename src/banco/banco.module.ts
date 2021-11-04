import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banco } from './entities/banco.entity';
import { BancoService } from './banco.service';
import { BancoController } from './banco.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Banco])],
  controllers: [BancoController],
  providers: [BancoService],
})
export class BancoModule {}
