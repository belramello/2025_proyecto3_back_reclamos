import { Inject, Injectable } from '@nestjs/common';
import type { IRolesRepository } from './repositories/roles-repository.interface';
import { RolesMapper } from './mappers/roles-mapper';
import { RespuestaFindOneRolesDto } from './dto/respuesta-find-one-roles.dto';
import { RolDocumentType } from './schema/rol.schema'; // Importamos el tipo Documento

@Injectable()
export class RolesService {
  constructor(
    @Inject('IRolesRepository')
    private readonly rolesRepository: IRolesRepository,
    private readonly rolesMapper: RolesMapper,
  ) {}

  async findAll(): Promise<RespuestaFindOneRolesDto[]> {
    return this.rolesMapper.toRespuestaFindOneRoles(
      await this.rolesRepository.findAll(),
    );
  }

  // Corregido: Devuelve RolDocumentType
  async findOne(id: string): Promise<RolDocumentType | null> {
    return await this.rolesRepository.findOne(id);
  }

  // Corregido: Devuelve RolDocumentType
  async findByName(nombre: string): Promise<RolDocumentType | null> {
    return await this.rolesRepository.findByName(nombre);
  }
}