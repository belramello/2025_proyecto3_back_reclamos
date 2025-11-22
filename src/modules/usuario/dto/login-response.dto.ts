export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  usuario: {
    nombre?: string;
    email: string;
  };
}
