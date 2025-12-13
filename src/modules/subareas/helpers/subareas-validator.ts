import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubareasService } from '../subareas.service';
import { Subarea } from '../schemas/subarea.schema';
import { UsuariosValidator } from 'src/modules/usuario/helpers/usuarios-validator';
import { Usuario } from 'src/modules/usuario/schema/usuario.schema';

@Injectable()
export class SubareasValidator {
  constructor(
    @Inject(forwardRef(() => SubareasService))
    private readonly subareasService: SubareasService,
    
    // Agregamos @Inject(forwardRef(...)) 
    @Inject(forwardRef(() => UsuariosValidator))
    private readonly usuariosValidator: UsuariosValidator,
  ) {}

  async validateSubareaExistente(id: string): Promise<Subarea> {
    const subarea = await this.subareasService.findOne(id);
    if (!subarea) {
      throw new NotFoundException(`El subarea con ID ${id} no existe`);
    }
    return subarea;
  }

  async validateNoCliente(usuarioId: string): Promise<Usuario> {
    return await this.usuariosValidator.validateNoCliente(usuarioId);
  }
}