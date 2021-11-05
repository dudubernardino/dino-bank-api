import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, IsDateString } from 'class-validator';

export class CreateTitularDto {
  @ApiProperty({ example: 'Eduardo' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: '013.747.600-05' })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({ example: '2000-02-11' })
  @IsDateString()
  @IsNotEmpty()
  dataNascimento: Date;

  @ApiProperty({ example: 'Pai Eduardo' })
  @IsString()
  @IsNotEmpty()
  nomePai: string;

  @ApiProperty({ example: 'Mãe Eduardo' })
  @IsString()
  @IsNotEmpty()
  nomeMae: string;

  @ApiProperty({ example: 'Fortaleza' })
  @IsString()
  @IsNotEmpty()
  cidade: string;

  @ApiProperty({ example: 'Ceará' })
  @IsString()
  @IsNotEmpty()
  estado: string;
}
