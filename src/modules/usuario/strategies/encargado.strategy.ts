import { RolesEnum } from 'src/modules/roles/enums/roles-enum';
import { UsuarioCreacionStrategy } from './usuario-creacion.strategy.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UsuariosValidator } from '../helpers/usuarios-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsuarioDocumentType } from '../schema/usuario.schema';
import { CreacionUsuarioDto } from '../dto/creacion-usuario.dto';
import { RolDocumentType } from 'src/modules/roles/schema/rol.schema';
import { UsuariosHelper } from '../helpers/usuarios-helper';
import { AreaDocumentType } from 'src/modules/areas/schemas/area.schema';

@Injectable()
export class EncargadoStrategy implements UsuarioCreacionStrategy {
  constructor(
    private readonly usuariosValidator: UsuariosValidator,
    private readonly usuariosHelper: UsuariosHelper,
  ) {}
  tipo = RolesEnum.ENCARGADO_DE_AREA;

  async validate(
    actor: UsuarioDocumentType,
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<AreaDocumentType> {
    this.usuariosValidator.validateAdminExistente(String(actor._id));
    if (!createUsuarioDto.area) {
      throw new BadRequestException(
        'Para crear un encargado, el area es obligatoria.',
      );
    }
    const area = await this.usuariosValidator.validateAreaExistente(
      createUsuarioDto.area,
    );
    return area;
  }

  async prepareData(
    dto: CreateUsuarioDto,
    rol: RolDocumentType,
    area?: AreaDocumentType,
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
      area: area,
      contraseña: hash,
      tokenActivacion: token,
      tokenExpiracion: expiracion,
    };
  }

  async crear(
    actor: UsuarioDocumentType,
    dto: CreateUsuarioDto,
    rol: RolDocumentType,
  ): Promise<CreacionUsuarioDto> {
    const area = await this.validate(actor, dto);
    return this.prepareData(dto, rol, area);
  }
}
