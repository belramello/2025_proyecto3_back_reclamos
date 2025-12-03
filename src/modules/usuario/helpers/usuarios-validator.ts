import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuarioService } from '../usuario.service';
import { Usuario, UsuarioDocumentType } from '../schema/usuario.schema';
import { RolesEnum } from 'src/modules/roles/enums/roles-enum';
import { RespuestaUsuarioDto } from '../dto/respuesta-usuario.dto';
import { Subarea } from 'src/modules/subareas/schemas/subarea.schema';

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

  async validateSubareaAsignadaAEmpleado(usuario: Usuario): Promise<Subarea> {
    if (usuario.subarea == null) {
      throw new UnauthorizedException(`El usuario no tiene subarea asignada.`);
    }
    return usuario.subarea;
  }

  async validateUsuarioExistente(usuarioId: string): Promise<Usuario> {
    const usuario = await this.usuariosService.findOneForAuth(usuarioId);
    return usuario;
  }

  async validateNoCliente(usuarioId: string): Promise<Usuario> {
    const usuario = await this.validateUsuarioExistente(usuarioId);
    if (usuario.rol.nombre === RolesEnum.CLIENTE) {
      throw new UnauthorizedException(`El usuario es un cliente.`);
    }
    return usuario;
  }
}
