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
import { Area } from 'src/modules/areas/schemas/area.schema';

@Injectable()
export class UsuariosValidator {
  constructor(
    @Inject(forwardRef(() => UsuarioService))
    private readonly usuariosService: UsuarioService,
  ) {}
  async validateEmpleadoExistente(empleadoId: string): Promise<Usuario> {
    const empleado = await this.validateUsuarioExistente(empleadoId);
    if (empleado.rol.nombre !== RolesEnum.EMPLEADO) {
      throw new UnauthorizedException(`El usuario no es un empleado`);
    }
    return empleado;
  }

  async validateEncargadoExistente(empleadoId: string): Promise<Usuario> {
    const empleado = await this.validateUsuarioExistente(empleadoId);
    if (empleado.rol.nombre !== RolesEnum.ENCARGADO_DE_AREA) {
      throw new UnauthorizedException(`El usuario no es un encargado`);
    }
    return empleado;
  }

  async validateSubareaAsignadaAEmpleado(usuario: Usuario): Promise<Subarea> {
    if (usuario.subarea == null) {
      throw new UnauthorizedException(`El usuario no tiene subarea asignada.`);
    }
    return usuario.subarea;
  }

  async validateAreaAsignadaAEncargado(usuario: Usuario): Promise<Area> {
    if (usuario.area == null) {
      throw new UnauthorizedException(`El usuario no tiene area asignada.`);
    }
    return usuario.area;
  }

  async validateUsuarioExistente(usuarioId: string): Promise<Usuario> {
    const usuario = await this.usuariosService.findOneForAuth(usuarioId);
    if (!usuario) {
      throw new NotFoundException(`El usuario con ID ${usuarioId} no existe`);
    }
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
