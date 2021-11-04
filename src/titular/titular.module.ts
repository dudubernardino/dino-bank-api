import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Titular } from './entities/titular.entity';
import { TitularService } from './titular.service';
import { TitularController } from './titular.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Titular])],
  controllers: [TitularController],
  providers: [TitularService],
})
export class TitularModule {}
