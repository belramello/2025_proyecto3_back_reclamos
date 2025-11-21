import { IsString } from 'class-validator';

export class CreateEstadoDto {
  @IsString()
  nombre: string;
}
