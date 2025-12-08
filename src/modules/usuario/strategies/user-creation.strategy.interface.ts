import { CreateUsuarioDto } from '../dto/create-usuario.dto';

export interface UserCreationStrategy {
  validate(dto: CreateUsuarioDto): void;
  prepareData(dto: CreateUsuarioDto): Promise<any>;
}