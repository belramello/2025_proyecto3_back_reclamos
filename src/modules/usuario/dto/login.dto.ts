import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;
  @IsNotEmpty({ message: 'La contraseña no debe estar vacía' })
  @MinLength(4, { message: 'La contraseña debe tener al menos 4 caracteres' })
  contraseña: string;
}
