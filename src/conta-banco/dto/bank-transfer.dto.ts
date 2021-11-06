import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsNumber, IsString } from 'class-validator';

export class BankTransferDto {
  @ApiProperty({ example: 'c932d460-0de9-4385-a4c6-18cdeb23087a' })
  @IsString()
  @IsNotEmpty()
  titularSenderId: string;

  @ApiProperty({ example: 789654 })
  @IsInt()
  @IsNotEmpty()
  conta: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  digito: number;

  @ApiProperty({ example: '0001' })
  @IsString()
  @IsNotEmpty()
  agencia: number;

  @ApiProperty({ example: 789654 })
  @IsNumber()
  @IsNotEmpty()
  valor: number;
}
