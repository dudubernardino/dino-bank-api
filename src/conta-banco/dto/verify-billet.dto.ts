import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyBilletDto {
  @ApiProperty({
    example:
      '0256.9.$2b$08$EQsJOVkmRGnlKZW6rxJ1Pej5ol0SM6SILYq5Mswz3Vk3FNcj3oHYm.1.8799.0000000400',
  })
  @IsString()
  @IsNotEmpty()
  linhaDigitavel: string;
}
