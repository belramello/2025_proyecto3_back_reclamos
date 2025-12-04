import { Permiso } from "src/modules/permisos/schemas/permiso.schema";

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  usuario: {
    nombre?: string;
    email: string;
    rol: string;
    permisos: Permiso[];
  };
}
