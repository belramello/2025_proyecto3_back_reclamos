import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UsuarioDocumentType } from '../schema/usuario.schema';
import { UsuariosValidator } from '../helpers/usuarios-validator';

export interface StrategyContext {
  actor?: UsuarioDocumentType;
  validators?: {
    usuarios: UsuariosValidator;
  };
}

export interface UserCreationStrategy {
  validate(dto: CreateUsuarioDto, context?: StrategyContext): Promise<void> | void;
  prepareData(dto: CreateUsuarioDto): Promise<any>;
}