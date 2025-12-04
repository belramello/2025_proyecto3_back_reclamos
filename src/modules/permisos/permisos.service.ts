import { Inject, Injectable } from '@nestjs/common';
import type { IPermisosRepository } from './repositories/permisos-repository.interface';
import { PermisosValidator } from './helpers/permisos-validator';
import { Permiso } from './schemas/permiso.schema';

@Injectable()
export class PermisosService {
  constructor(
    @Inject('IPermisosRepository')
    private readonly permisosRepository: IPermisosRepository,
    private readonly permisosValidator: PermisosValidator,
  ) {}

  async findAll(): Promise<Permiso[]> {
    return await this.permisosRepository.findAll();
  }

  async findOne(id: string): Promise<Permiso | null> {
    return await this.permisosRepository.findOne(id);
  }

  async findAllByRol(rolId: string): Promise<Permiso[]> {
    await this.permisosValidator.validateRolExistente(rolId);
    return await this.permisosRepository.findAllByRol(rolId);
  }
}
