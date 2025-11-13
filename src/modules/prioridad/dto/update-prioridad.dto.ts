import { PartialType } from '@nestjs/mapped-types';
import { CreatePrioridadDto } from './create-prioridad.dto';

export class UpdatePrioridadDto extends PartialType(CreatePrioridadDto) {}
