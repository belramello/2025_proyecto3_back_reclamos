import { Controller, Get, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RespuestaFindOneRolesDto } from './dto/respuesta-find-one-roles.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los roles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles',
    type: RespuestaFindOneRolesDto,
    isArray: true,
  })
  findAll(): Promise<RespuestaFindOneRolesDto[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID del rol' })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado',
    type: RespuestaFindOneRolesDto,
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rolesService.findOne(id);
  }
}
