import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateBancoDto {
  @ApiProperty({ example: 4554 })
  @IsInt()
  @IsNotEmpty()
  codigo: number;

  @ApiProperty({ example: 123456 })
  @IsInt()
  @IsNotEmpty()
  agencia: number;
}
