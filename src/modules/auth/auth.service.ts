import { Injectable } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from '../usuario/dto/login.dto';
import { LoginResponseDto } from '../usuario/dto/login-response.dto';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { AuthValidator } from './helpers/auth-validator';
import { AuthMapper } from './mappers/auth-mapper';
import { UsuarioDocumentType } from '../usuario/schema/usuario.schema';
import * as bcrypt from 'bcrypt';
import { ActivarCuentaDto } from './dto/activar-cuenta.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsuarioService,
    private readonly authValidator: AuthValidator,
    private readonly authMapper: AuthMapper,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const usuario: UsuarioDocumentType =
        await this.authValidator.validarEmailExistente(loginDto.email);

      await this.authValidator.validarContraseñaCorrecta(
        loginDto.contraseña,
        usuario.contraseña,
      );
      const payload = { email: usuario.email, sub: usuario._id.toString() };
      return this.authMapper.toLoginResponseDto(
        this.jwtService.generateToken(payload, 'auth'),
        this.jwtService.generateToken(payload, 'refresh'),
        usuario,
      );
    } catch (error) {
      await this.authValidator
        .validarEmailExistente(loginDto.email)
        .catch(() => null);
      throw error;
    }
  }

  async register(createUserDto: CreateUsuarioDto): Promise<LoginResponseDto> {
    const nuevoUsuario = await this.userService.create(createUserDto);
    const payload = {
      email: nuevoUsuario.email,
      sub: nuevoUsuario.id,
    };
    const accessToken = this.jwtService.generateToken(payload, 'auth');
    const refreshToken = this.jwtService.generateToken(payload, 'refresh');
    return this.authMapper.toLoginResponseDto(
      accessToken,
      refreshToken,
      nuevoUsuario,
    );
  }

  async refresh(refreshToken: string): Promise<LoginResponseDto> {
    const {
      accessToken,
      refreshToken: newRefreshToken,
      payload,
    } = this.jwtService.refreshToken(refreshToken);
    const user = await this.authValidator.validarUsuarioExistente(payload.sub);
    return this.authMapper.toLoginResponseDto(
      accessToken,
      newRefreshToken || refreshToken,
      user,
    );
  }

  async activarCuenta(
    activarCuentaDto: ActivarCuentaDto,
  ): Promise<{ message: string }> {
    const { token, contraseña } = activarCuentaDto;
    const usuario = await this.authValidator.findUsuarioByToken(token);
    await this.authValidator.validateTokenNoExpirado(usuario);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contraseña, salt);
    await this.userService.activateUser(String(usuario._id), hash);
    return { message: 'Cuenta activada con éxito. Ya puede iniciar sesión.' };
  }
}
