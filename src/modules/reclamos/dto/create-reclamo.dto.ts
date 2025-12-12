import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Prioridad } from './respuesta-create-reclamo.dto';

export class CreateReclamoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsMongoId()
  tipoReclamo: string;

  @IsEnum(Prioridad)
  @IsNotEmpty()
  prioridad: Prioridad;

  @IsNumber()
  @Min(1)
  @Max(10)
  @IsNotEmpty()
  nivelCriticidad: number;

  @IsMongoId()
  @IsNotEmpty()
  proyecto: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsArray()
  @IsOptional()
  imagenUrl?: string[];
}
