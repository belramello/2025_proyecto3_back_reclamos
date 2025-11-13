import { PartialType } from '@nestjs/mapped-types';
import { CreateReclamoDto } from './create-reclamo.dto';

export class UpdateReclamoDto extends PartialType(CreateReclamoDto) {}
