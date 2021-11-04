import { PartialType } from '@nestjs/swagger';
import { CreateTitularDto } from './create-titular.dto';

export class UpdateTitularDto extends PartialType(CreateTitularDto) {}
