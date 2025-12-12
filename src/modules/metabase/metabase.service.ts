import { Injectable } from '@nestjs/common';
import { RolesEnum } from '../roles/enums/roles-enum';
import { MetabaseStrategy } from './strategies/metabase-strategy';
import { AdministradorStrategy } from './strategies/administrador-strategy';
import { EncargadoStrategy } from './strategies/encargado-strategy';
import { EmpleadoStrategy } from './strategies/empleado-strategy';

@Injectable()
export class MetabaseService {
  private readonly metabaseSecretKey = process.env.METABASE_SECRET_KEY;
  private readonly metabaseUrl =
    process.env.METABASE_URL || 'http://localhost:4000';

  generateSignedUrl(userId: string, rol: string): { signedUrl: string } {
    if (!this.metabaseSecretKey) {
      throw new Error('Metabase secret key not configured');
    }

    const jwt = require('jsonwebtoken');
    //de acuerdo al rol del usuario, se asigna una strategy y se genera el payload.
    const strategy: MetabaseStrategy = this.getStrategy(rol);
    const payload = strategy.generatePayloard(userId);
    const token = jwt.sign(payload, this.metabaseSecretKey);
    const signedUrl = `${this.metabaseUrl}/embed/dashboard/${token}#background=false&bordered=false&titled=false`;
    return { signedUrl };
  }

  private getStrategy = (rol: string): MetabaseStrategy => {
    switch (rol) {
      case RolesEnum.ADMINISTRADOR:
        return new AdministradorStrategy();
      case RolesEnum.ENCARGADO_DE_AREA:
        return new EncargadoStrategy();
      case RolesEnum.EMPLEADO:
        return new EmpleadoStrategy();
      default:
        throw new Error('No se encontró un rol válido');
    }
  };
}
