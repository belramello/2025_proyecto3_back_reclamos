import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from '../usuario/dto/login.dto';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { LoginResponseDto } from '../usuario/dto/login-response.dto';

// --- MOCKS DE DATOS Y SERVICIOS ---

const MOCK_REFRESH_TOKEN = 'mock-refresh-token-value';
const MOCK_ACCESS_TOKEN = 'mock-access-token-value';
const MOCK_EMAIL = 'test@example.com';
const MOCK_PASSWORD = 'securepassword';

// 1. DTOs de entrada
const mockLoginDto: LoginDto = { email: MOCK_EMAIL, contraseña: MOCK_PASSWORD };
const mockCreateDto: CreateUsuarioDto = {
  nombreUsuario: 'newuser',
  email: 'new@example.com',
  contraseña: MOCK_PASSWORD,
  rol: 'rol-1',
};

// 2. DTO de respuesta esperado
const mockLoginResponse: LoginResponseDto = {
  accessToken: MOCK_ACCESS_TOKEN,
  refreshToken: MOCK_REFRESH_TOKEN,
  usuario: {
    nombre: 'Test',
    email: MOCK_EMAIL,
    rol: 'ADMIN',
    permisos: [],
  },
};

// 3. Mock del AuthService para aislar el controlador
const mockAuthService = {
  login: jest.fn().mockResolvedValue(mockLoginResponse),
  register: jest.fn().mockResolvedValue(mockLoginResponse),
  refresh: jest.fn().mockResolvedValue(mockLoginResponse),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  // ----------------------------------------------------------------
  // 1. POST /auth/login
  // ----------------------------------------------------------------
  describe('login', () => {
    it('debe llamar a authService.login con el LoginDto y retornar el DTO de respuesta', async () => {
      const result = await controller.login(mockLoginDto);

      expect(service.login).toHaveBeenCalledWith(mockLoginDto);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  // ----------------------------------------------------------------
  // 2. POST /auth/register
  // ----------------------------------------------------------------
  describe('register', () => {
    it('debe llamar a authService.register con el CreateUsuarioDto y retornar el DTO de respuesta', async () => {
      const result = await controller.register(mockCreateDto);

      expect(service.register).toHaveBeenCalledWith(mockCreateDto);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  // ----------------------------------------------------------------
  // 3. POST /auth/refresh
  // ----------------------------------------------------------------
  describe('refresh', () => {
    it('debe llamar a authService.refresh con el refreshToken del cuerpo y retornar el DTO de respuesta', async () => {
      const result = await controller.refresh(MOCK_REFRESH_TOKEN);

      // Verificamos que el valor extraído del @Body('refreshToken') se pasa correctamente
      expect(service.refresh).toHaveBeenCalledWith(MOCK_REFRESH_TOKEN);
      expect(result).toEqual(mockLoginResponse);
    });
  });
});
