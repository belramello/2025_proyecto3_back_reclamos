import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoReclamoDto } from './create-tipo-reclamo.dto';

export class UpdateTipoReclamoDto extends PartialType(CreateTipoReclamoDto) {}
