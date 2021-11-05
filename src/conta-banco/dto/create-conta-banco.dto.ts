import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsNumber, IsString } from 'class-validator';

import { Banco } from '../../banco/entities/banco.entity';
import { Titular } from '../../titular/entities/titular.entity';

export class CreateContaBancoDto {
  @ApiProperty({ example: 789654 })
  @IsInt()
  @IsNotEmpty()
  conta: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  digito: number;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @IsNotEmpty()
  saldo: number;

  @ApiProperty({ example: '109c9187-672b-4ed7-b4bb-d256808e5165' })
  @IsString()
  @IsNotEmpty()
  bancoId: string;

  @ApiProperty({ example: 'c932d460-0de9-4385-a4c6-18cdeb23087a' })
  @IsString()
  @IsNotEmpty()
  titularId: string;

  banco: Banco;

  titular: Titular;
}
