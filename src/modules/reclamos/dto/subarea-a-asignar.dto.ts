import { IsOptional, IsString, MinLength } from 'class-validator';

export class SubareaAAsignarDto {
  @IsString()
  @MinLength(5)
  subareaId: string;

  @IsString()
  @IsOptional()
  comentario?: string;
}
