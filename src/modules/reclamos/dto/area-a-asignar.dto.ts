import { IsOptional, IsString, MinLength } from 'class-validator';

export class AreaAAsignarDto {
  @IsString()
  @MinLength(5)
  areaId: string;

  @IsString()
  @IsOptional()
  comentario?: string;
}
