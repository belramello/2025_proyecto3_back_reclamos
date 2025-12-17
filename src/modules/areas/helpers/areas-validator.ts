import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AreasService } from '../areas.service';
import { AreaDocumentType } from '../schemas/area.schema';
import { UsuariosValidator } from 'src/modules/usuario/helpers/usuarios-validator';
import { Usuario } from 'src/modules/usuario/schema/usuario.schema';

@Injectable()
export class AreasValidator {
  constructor(
    @Inject(forwardRef(() => AreasService))
    private readonly areasService: AreasService,
    @Inject(forwardRef(() => UsuariosValidator))
    private readonly usuarioValidator: UsuariosValidator,
  ) {}

  async validateAreaExistente(areaId: string): Promise<AreaDocumentType> {
    const area = await this.areasService.findOne(areaId);
    if (!area) {
      throw new NotFoundException(`La área con ID ${areaId} no existe`);
    }
    return area;
  }

  async validateNoCliente(usuarioId: string): Promise<Usuario> {
    return await this.usuarioValidator.validateNoCliente(usuarioId);
  }
}
