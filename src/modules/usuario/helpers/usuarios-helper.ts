import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RolesService } from 'src/modules/roles/roles.service';
import { RolDocumentType } from 'src/modules/roles/schema/rol.schema';

@Injectable()
export class UsuariosHelper {
  constructor(private readonly rolesService: RolesService) {}
  async generarToken(): Promise<{
    hash: string;
    token: string;
    expiracion: Date;
  }> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + 24);
    const passTemp = crypto.randomBytes(10).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(passTemp, salt);
    return { hash, token, expiracion };
  }

  async buscarRolEncargado(rolNombre: string): Promise<RolDocumentType> {
    const rol = await this.rolesService.findByName(rolNombre);
    if (!rol) {
      throw new InternalServerErrorException(
        'No se pudo encontrar el ID del rol de encargado.',
      );
    }
    return rol;
  }
}
