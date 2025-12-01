import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEmail()
  email: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'La contraseña no debe estar vacía' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MinLength(4, { message: 'La contraseña debe tener al menos 4 caracteres' })
  password: string;
}
