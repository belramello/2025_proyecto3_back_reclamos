import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../schema/usuario.schema';
import { RolesEnum } from 'src/modules/roles/enums/roles-enum';

@Injectable()
export class UsuariosValidator {
  constructor(
    @Inject(forwardRef(() => UsuarioService))
    private readonly usuariosService: UsuarioService,
  ) {}
  async validateEmpleadoExistente(empleadoId: string): Promise<Usuario> {
    const empleado = await this.usuariosService.findOneForAuth(empleadoId);
    if (!empleado) {
      throw new NotFoundException(`El usuario con ID ${empleadoId} no existe`);
    }
    if (empleado.rol.nombre !== RolesEnum.EMPLEADO) {
      throw new UnauthorizedException(`El usuario no es un empleado`);
    }
    return empleado;
  }
}
