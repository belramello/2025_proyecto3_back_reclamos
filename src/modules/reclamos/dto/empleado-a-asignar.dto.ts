import { IsString, MinLength } from 'class-validator';

export class EmpleadoAASignarDto {
  @IsString()
  @MinLength(5)
  empleadoId: string;
}
