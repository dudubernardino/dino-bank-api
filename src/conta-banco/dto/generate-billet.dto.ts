import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GenerateBilletDto {
  @ApiProperty({ example: 'c932d460-0de9-4385-a4c6-18cdeb23087a' })
  @IsString()
  @IsNotEmpty()
  titularSenderId: string;

  @ApiProperty({ example: '001' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({ example: '001' })
  @IsString()
  @IsNotEmpty()
  agencia: string;

  @ApiProperty({ example: 400 })
  @IsNumber()
  @IsNotEmpty()
  valor: number;
}
