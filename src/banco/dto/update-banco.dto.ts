import { PartialType } from '@nestjs/swagger';
import { CreateBancoDto } from './create-banco.dto';

export class UpdateBancoDto extends PartialType(CreateBancoDto) {}
