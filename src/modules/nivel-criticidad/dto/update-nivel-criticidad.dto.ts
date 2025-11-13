import { PartialType } from '@nestjs/mapped-types';
import { CreateNivelCriticidadDto } from './create-nivel-criticidad.dto';

export class UpdateNivelCriticidadDto extends PartialType(CreateNivelCriticidadDto) {}
