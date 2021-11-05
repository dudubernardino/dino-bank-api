import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBancoDto {
  @ApiProperty({ example: '4554' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  agencia: string;
}
