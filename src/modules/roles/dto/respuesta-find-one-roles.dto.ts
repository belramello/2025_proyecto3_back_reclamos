import { ApiProperty } from '@nestjs/swagger';
import { Permiso } from '../../../modules/permisos/schemas/permiso.schema';

export class RespuestaFindOneRolesDto {
  @ApiProperty({ example: '67ab31e01399c8f5920a1b3d' })
  id: string;

  @ApiProperty({
    example: 'Encargado de área',
    description: 'Nombre del rol',
  })
  nombre: string;

  @ApiProperty({
    type: [Permiso],
    description: 'Permisos asociados al rol (populate)',
  })
  permisos: Permiso[];
}
