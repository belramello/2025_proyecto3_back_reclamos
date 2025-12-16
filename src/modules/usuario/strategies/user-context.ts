import { Injectable, BadRequestException } from '@nestjs/common';
import { RolesEnum } from 'src/modules/roles/enums/roles-enum';
import { UserCreationStrategy } from './user-creation.strategy.interface';
import { ClienteCreationStrategy } from './cliente-creation.strategy';
import { EmpleadoCreationStrategy } from './empleado-creation.strategy';
import { AdminCreationStrategy } from './admin-creation.strategy';
import { EncargadoCreationStrategy } from './encargado-creation.strategy';

@Injectable()
export class UserContext {
  private strategies: Record<string, UserCreationStrategy> = {
    [RolesEnum.CLIENTE]: new ClienteCreationStrategy(),
    [RolesEnum.EMPLEADO]: new EmpleadoCreationStrategy(),
    [RolesEnum.ADMINISTRADOR]: new AdminCreationStrategy(),
    [RolesEnum.ENCARGADO_DE_AREA]: new EncargadoCreationStrategy(),
  };

  getStrategy(rolNombre: string): UserCreationStrategy {
    const strategy = this.strategies[rolNombre];
    if (!strategy) {
      throw new BadRequestException(
        `No hay estrategia definida para el rol: ${rolNombre}`,
      );
    }
    return strategy;
  }
}
