import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsDecimal } from 'class-validator';

export class CreateContaBancoDto {
  @ApiProperty({ example: 789654 })
  @IsInt()
  @IsNotEmpty()
  conta: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  digito: number;

  @ApiProperty({ example: 789654 })
  @IsDecimal()
  @IsNotEmpty()
  saldo: number;
}
