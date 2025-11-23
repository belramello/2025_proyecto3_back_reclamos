import { PartialType } from '@nestjs/swagger';
import { CreateHistorialAsignacionDto } from './create-historial-asignacion.dto';

export class UpdateHistorialAsignacionDto extends PartialType(CreateHistorialAsignacionDto) {}
