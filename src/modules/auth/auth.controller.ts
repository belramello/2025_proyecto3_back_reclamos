import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body } from '@nestjs/common';
import { LoginDto } from '../usuario/dto/login.dto';
import { LoginResponseDto } from '../usuario/dto/login-response.dto';
import { ActivarCuentaDto } from './dto/activar-cuenta.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ): Promise<LoginResponseDto> {
    return await this.authService.refresh(refreshToken);
  }

  @Post('activar-cuenta')
  async activarCuenta(@Body() activarCuentaDto: ActivarCuentaDto) {
    return await this.authService.activarCuenta(activarCuentaDto);
  }
}
