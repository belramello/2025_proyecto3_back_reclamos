import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { TipoProyecto } from '../enums/TipoProyectoEnum';

export class CreateProyectoDto {
  @IsString({ message: 'El título debe ser texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  titulo: string;

  @IsString({ message: 'La descripción debe ser texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  descripcion: string;

  @IsString({ message: 'La descripción detallada debe ser texto.' })
  @IsOptional()
  descripcionDetallada?: string;

  @IsDateString(
    {},
    { message: 'La fecha debe tener un formato válido (ISO 8601).' },
  )
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria.' })
  fechaInicio: string;

  @IsString({ message: 'El tipo de proyecto es obligatorio.' })
  @IsNotEmpty()
  tipo: TipoProyecto;

  @IsMongoId({ message: 'El ID del cliente no es válido.' })
  @IsNotEmpty({ message: 'El cliente es obligatorio.' })
  cliente: string;
}
