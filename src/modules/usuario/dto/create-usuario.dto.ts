import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProyectoDto } from 'src/modules/proyectos/dto/create-proyecto.dto';

export class CreateUsuarioDto {
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  readonly nombreUsuario: string;

  @IsEmail({}, { message: 'El email debe ser una dirección de correo válida.' })
  @IsNotEmpty({ message: 'El email es obligatorio.' })
  readonly email: string;

  // CAMBIO: Ahora es opcional. Si no viene, el sistema asume flujo de invitación.
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @IsOptional()
  readonly contraseña?: string;

  @IsString({ message: 'El rol debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El rol es obligatorio.' })
  readonly rol: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsOptional()
  readonly nombre?: string;

  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @IsOptional()
  readonly direccion?: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  @IsOptional()
  readonly telefono?: string;

  @IsString({ message: 'La subárea debe ser una cadena de texto.' })
  @IsOptional()
  readonly subarea?: string;

  @IsString({ message: 'El área debe ser una cadena de texto.' })
  @IsOptional()
  readonly area?: string;
  
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProyectoDto)
  readonly proyecto?: CreateProyectoDto;
}