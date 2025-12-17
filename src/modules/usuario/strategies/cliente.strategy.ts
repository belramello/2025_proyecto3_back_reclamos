import { RolesEnum } from 'src/modules/roles/enums/roles-enum';
import { UsuarioCreacionStrategy } from './usuario-creacion.strategy.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UsuariosValidator } from '../helpers/usuarios-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsuarioDocumentType } from '../schema/usuario.schema';
import { CreacionUsuarioDto } from '../dto/creacion-usuario.dto';
import { RolDocumentType } from 'src/modules/roles/schema/rol.schema';
import { UsuariosHelper } from '../helpers/usuarios-helper';

@Injectable()
export class ClienteStrategy implements UsuarioCreacionStrategy {
  constructor(
    private readonly usuariosValidator: UsuariosValidator,
    private readonly usuariosHelper: UsuariosHelper,
  ) {}
  tipo = RolesEnum.CLIENTE;

  async validate(
    actor: UsuarioDocumentType,
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<void> {
    this.usuariosValidator.validateAdminExistente(String(actor._id));
    if (!createUsuarioDto.telefono) {
      throw new BadRequestException(
        'Para crear un cliente, el telefono es obligatorio.',
      );
    }
    if (!createUsuarioDto.direccion) {
      throw new BadRequestException(
        'Para crear un cliente, la dirección es obligatoria',
      );
    }
  }

  async prepareData(
    dto: CreateUsuarioDto,
    rol: RolDocumentType,
  ): Promise<CreacionUsuarioDto> {
    const { hash, token, expiracion } =
      await this.usuariosHelper.generarToken();
    return {
      nombreUsuario:
        dto.nombreUsuario ||
        this.usuariosHelper.generarNombreUsuario(dto.nombre),
      email: dto.email,
      nombre: dto.nombre,
      rol: rol,
      contraseña: hash,
      telefono: dto.telefono,
      direccion: dto.direccion,
      tokenActivacion: token,
      tokenExpiracion: expiracion,
    };
  }

  async crear(
    actor: UsuarioDocumentType,
    dto: CreateUsuarioDto,
    rol: RolDocumentType,
  ): Promise<CreacionUsuarioDto> {
    await this.validate(actor, dto);
    return this.prepareData(dto, rol);
  }
}
