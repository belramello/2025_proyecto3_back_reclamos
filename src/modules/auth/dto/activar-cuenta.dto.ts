import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ActivarCuentaDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contraseña: string;
}