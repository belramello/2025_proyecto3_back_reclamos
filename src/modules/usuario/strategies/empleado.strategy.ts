import { RolesEnum } from 'src/modules/roles/enums/roles-enum';
import { UsuarioCreacionStrategy } from './usuario-creacion.strategy.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UsuariosValidator } from '../helpers/usuarios-validator';
import { Injectable } from '@nestjs/common';
import { UsuarioDocumentType } from '../schema/usuario.schema';
import { CreacionUsuarioDto } from '../dto/creacion-usuario.dto';
import { RolDocumentType } from 'src/modules/roles/schema/rol.schema';
import { UsuariosHelper } from '../helpers/usuarios-helper';
import { SubareaDocumentType } from 'src/modules/subareas/schemas/subarea.schema';
import { AreaDocumentType } from 'src/modules/areas/schemas/area.schema';

@Injectable()
export class EmpleadoStrategy implements UsuarioCreacionStrategy {
  constructor(
    private readonly usuariosValidator: UsuariosValidator,
    private readonly usuariosHelper: UsuariosHelper,
  ) {}
  tipo = RolesEnum.EMPLEADO;

  async validate(
    actor: UsuarioDocumentType,
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<SubareaDocumentType> {
    this.usuariosValidator.validateEncargadoExistente(String(actor._id));
    if (!createUsuarioDto.subarea) {
      throw new Error('Para crear un Empleado, la Subarea es obligatoria.');
    }
    const subarea = await this.usuariosValidator.validateSubareaDeEncargado(
      createUsuarioDto.subarea,
      actor,
    );
    return subarea;
  }

  async prepareData(
    dto: CreateUsuarioDto,
    rol: RolDocumentType,
    area?: AreaDocumentType,
    subarea?: SubareaDocumentType,
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
      subarea: subarea,
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
    const subarea = await this.validate(actor, dto);
    return this.prepareData(dto, rol, undefined, subarea);
  }
}
