import { PartialType } from '@nestjs/swagger';
import { CreateContaBancoDto } from './create-conta-banco.dto';

export class UpdateContaBancoDto extends PartialType(CreateContaBancoDto) {}
