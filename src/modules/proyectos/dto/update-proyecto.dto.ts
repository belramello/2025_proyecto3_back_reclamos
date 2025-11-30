import { PartialType } from '@nestjs/swagger';
import { CreateProyectoDto } from './create-proyecto.dto';

export class UpdateProyectoDto extends PartialType(CreateProyectoDto) {}
