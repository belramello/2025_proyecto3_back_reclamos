import { PartialType } from '@nestjs/swagger';
import { CreateHistorialEstadoDto } from './create-historial-estado.dto';

export class UpdateHistorialEstadoDto extends PartialType(CreateHistorialEstadoDto) {}
