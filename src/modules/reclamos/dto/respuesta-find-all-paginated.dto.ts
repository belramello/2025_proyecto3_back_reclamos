import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { RespuestaReclamoDto } from './respuesta-reclamo.dto';

export class RespuestaFindAllPaginatedReclamoDTO {
  @ApiProperty({
    description: 'Lista de prodcutos del usuario',
    type: [RespuestaReclamoDto],
  })
  @Type(() => RespuestaReclamoDto)
  feedback: RespuestaReclamoDto[];

  @ApiProperty({
    description: 'Número total de reclamos',
    type: Number,
    example: 3,
  })
  @IsInt({ message: 'El total debe ser un número entero' })
  total: number;

  @ApiProperty({
    description: 'Número de la página actual',
    type: Number,
    example: 1,
  })
  @IsInt({ message: 'La página debe ser un número entero' })
  page: number;

  @ApiProperty({
    description: 'Número de la última página disponible',
    type: Number,
    example: 2,
  })
  @Expose()
  @IsInt({ message: 'La última página debe ser un número entero' })
  lastPage: number;
}
