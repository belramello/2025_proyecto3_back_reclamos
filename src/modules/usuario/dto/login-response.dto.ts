export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  usuario: {
    nombre?: string;
    email: string;
    rol: string;
    permisos: string[];
  };
}
