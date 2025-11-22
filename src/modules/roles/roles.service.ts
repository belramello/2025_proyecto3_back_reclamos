import { Inject, Injectable } from '@nestjs/common';
import type { IRolesRepository } from './repositories/roles-repository.interface';
import { RolesMapper } from './mappers/roles-mapper';
import { RespuestaFindOneRolesDto } from './dto/respuesta-find-one-roles.dto';
import { Rol } from './schema/rol.schema';

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

  async findOne(id: string): Promise<Rol | null> {
    return await this.rolesRepository.findOne(id);
  }
}
