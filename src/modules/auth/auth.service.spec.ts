import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '../jwt/jwt.service';
import { UsuarioService } from '../usuario/usuario.service';
import { AuthValidator } from './helpers/auth-validator';
import { AuthMapper } from './mappers/auth-mapper';
import { LoginDto } from '../usuario/dto/login.dto';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { UsuarioDocumentType } from '../usuario/schema/usuario.schema';
import { LoginResponseDto } from '../usuario/dto/login-response.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as passwordHelper from './helpers/password-helper';

// --- MOCKS DE DATOS ---

const MOCK_USER_ID = 'user-id-123';
const MOCK_EMAIL = 'test@example.com';
const MOCK_ROL_NOMBRE = 'ADMIN';
const MOCK_ACCESSTOKEN = 'mock-access-token';
const MOCK_REFRESHTOKEN = 'mock-refresh-token';
const MOCK_PASSWORD = 'password123';

// 1. Valor estático para el hash
const MOCKED_HASH_VALUE = 'hashed-password';

const mockLoginDto: LoginDto = { email: MOCK_EMAIL, contraseña: MOCK_PASSWORD };
const mockCreateDto: CreateUsuarioDto = {
  nombreUsuario: 'testuser',
  email: MOCK_EMAIL,
  contraseña: MOCK_PASSWORD,
  rol: 'rol-id-1',
};

// Objeto de BD que tiene la contraseña hasheada
const mockUsuarioDB: UsuarioDocumentType = {
  _id: MOCK_USER_ID,
  email: MOCK_EMAIL,
  // 2. Usamos el valor estático en el mock de datos
  contraseña: MOCKED_HASH_VALUE,
  rol: { nombre: MOCK_ROL_NOMBRE, permisos: [] },
} as any;

// Respuesta de userService.create (debe tener el ID del nuevo usuario)
const mockUsuarioResponseDto = {
  id: MOCK_USER_ID,
  email: MOCK_EMAIL,
  rol: { nombre: MOCK_ROL_NOMBRE, permisos: [] },
} as any;

const mockLoginResponseDto: LoginResponseDto = {
  accessToken: MOCK_ACCESSTOKEN,
  refreshToken: MOCK_REFRESHTOKEN,
  usuario: {
    nombre: 'Test',
    email: MOCK_EMAIL,
    rol: MOCK_ROL_NOMBRE,
    permisos: [],
  },
};

const mockPayload = { email: MOCK_EMAIL, sub: MOCK_USER_ID };

// --- MOCKS DE DEPENDENCIAS Y HELPERS ---

// 3. SOLUCIÓN AL REFERENCE ERROR: Usamos el valor literal DENTRO del mock.
jest.mock('./helpers/password-helper', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed-password'), // <-- Valor literal aquí
  comparePasswords: jest.fn(),
}));

const mockJwtService = {
  generateToken: jest.fn(),
  refreshToken: jest.fn(),
  getPayload: jest.fn(),
};

const mockUserService = {
  create: jest.fn().mockResolvedValue(mockUsuarioResponseDto),
};

const mockAuthValidator = {
  validarEmailExistente: jest.fn().mockResolvedValue(mockUsuarioDB),
  validarContraseñaCorrecta: jest.fn().mockResolvedValue(true),
  validarEmailSinUsar: jest.fn().mockResolvedValue(null),
  validarUsuarioExistente: jest.fn().mockResolvedValue(mockUsuarioResponseDto),
};

const mockAuthMapper = {
  toLoginResponseDto: jest.fn().mockReturnValue(mockLoginResponseDto),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsuarioService, useValue: mockUserService },
        { provide: AuthValidator, useValue: mockAuthValidator },
        { provide: AuthMapper, useValue: mockAuthMapper },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
    // Resetear el mock de generateToken para cada prueba
    mockJwtService.generateToken.mockImplementation((payload, type) =>
      type === 'auth' ? MOCK_ACCESSTOKEN : MOCK_REFRESHTOKEN,
    );
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  // ----------------------------------------------------------------
  // 1. Método login()
  // ----------------------------------------------------------------
  describe('login', () => {
    // CASO DE ÉXITO
    it('debe validar las credenciales, generar tokens y retornar LoginResponseDto', async () => {
      const result = await service.login(mockLoginDto);

      expect(mockAuthValidator.validarEmailExistente).toHaveBeenCalledWith(
        MOCK_EMAIL,
      );
      expect(mockAuthValidator.validarContraseñaCorrecta).toHaveBeenCalledWith(
        MOCK_PASSWORD,
        MOCKED_HASH_VALUE, // Usa el valor hasheado mockeado
      );
      expect(mockJwtService.generateToken).toHaveBeenCalledTimes(2);
      expect(mockAuthMapper.toLoginResponseDto).toHaveBeenCalledWith(
        MOCK_ACCESSTOKEN,
        MOCK_REFRESHTOKEN,
        mockUsuarioDB,
      );
      expect(result).toEqual(mockLoginResponseDto);
    });

    // CASO DE FALLO (Email no existente, validación)
    it('debe relanzar la excepción si validarEmailExistente falla (NotFoundException)', async () => {
      const authError = new NotFoundException(
        'Usuario con email no encontrado',
      );
      // Mock para la llamada dentro del try y otra vez para el catch
      mockAuthValidator.validarEmailExistente.mockRejectedValue(authError);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        NotFoundException,
      );
      // Debe llamarse dos veces debido al bloque try-catch en el servicio
      expect(mockAuthValidator.validarEmailExistente).toHaveBeenCalledTimes(2);
      expect(
        mockAuthValidator.validarContraseñaCorrecta,
      ).not.toHaveBeenCalled();
    });

    // CASO DE FALLO (Contraseña incorrecta)
    it('debe relanzar la excepción si validarContraseñaCorrecta falla (BadRequestException)', async () => {
      const authError = new BadRequestException('Contraseña incorrecta');
      mockAuthValidator.validarEmailExistente.mockResolvedValueOnce(
        mockUsuarioDB,
      );
      mockAuthValidator.validarContraseñaCorrecta.mockRejectedValueOnce(
        authError,
      );

      // Mockear la llamada dentro del catch para evitar un error no manejado
      mockAuthValidator.validarEmailExistente.mockResolvedValueOnce(
        mockUsuarioDB,
      );

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockAuthValidator.validarEmailExistente).toHaveBeenCalledTimes(2);
      expect(mockAuthValidator.validarContraseñaCorrecta).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  // ----------------------------------------------------------------
  // 2. Método register()
  // ----------------------------------------------------------------
  describe('register', () => {
    it('debe validar, hashear, crear usuario, generar tokens y retornar LoginResponseDto', async () => {
      // Mockeamos la función de ayuda hashPassword (aunque ya lo está globalmente, es bueno espiarla)
      jest.spyOn(passwordHelper, 'hashPassword');

      const result = await service.register(mockCreateDto);

      expect(mockAuthValidator.validarEmailSinUsar).toHaveBeenCalledWith(
        MOCK_EMAIL,
      );
      expect(passwordHelper.hashPassword).toHaveBeenCalledWith(MOCK_PASSWORD);

      // Verifica que userService.create es llamado con la contraseña hasheada
      expect(mockUserService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockCreateDto,
          contraseña: MOCKED_HASH_VALUE, // Usa el valor hasheado mockeado
        }),
      );

      expect(mockJwtService.generateToken).toHaveBeenCalledTimes(2);
      expect(mockAuthMapper.toLoginResponseDto).toHaveBeenCalled();
      expect(result).toEqual(mockLoginResponseDto);
    });
  });

  // ----------------------------------------------------------------
  // 3. Método refresh()
  // ----------------------------------------------------------------
  describe('refresh', () => {
    const newRefreshToken = 'new-mock-refresh-token';

    // CASO 1: Token de refresh cerca de expirar (genera un nuevo refresh token)
    it('debe renovar ambos tokens si el refresh token está cerca de expirar', async () => {
      mockJwtService.refreshToken.mockReturnValue({
        accessToken: MOCK_ACCESSTOKEN,
        refreshToken: newRefreshToken, // Retorna un nuevo RT
      });
      mockJwtService.getPayload.mockReturnValue(mockPayload);

      const result = await service.refresh(MOCK_REFRESHTOKEN);

      expect(mockJwtService.refreshToken).toHaveBeenCalledWith(
        MOCK_REFRESHTOKEN,
      );
      expect(mockAuthValidator.validarUsuarioExistente).toHaveBeenCalledWith(
        MOCK_USER_ID,
      );

      // El mapper debe recibir el nuevo refresh token
      expect(mockAuthMapper.toLoginResponseDto).toHaveBeenCalledWith(
        MOCK_ACCESSTOKEN,
        newRefreshToken,
        mockUsuarioResponseDto,
      );
      expect(result).toEqual(mockLoginResponseDto);
    });

    // CASO 2: Token de refresh NO cerca de expirar (NO genera un nuevo refresh token)
    it('debe renovar solo el access token si el refresh token no está cerca de expirar', async () => {
      mockJwtService.refreshToken.mockReturnValue({
        accessToken: MOCK_ACCESSTOKEN,
        // NO retorna refreshToken
      });
      mockJwtService.getPayload.mockReturnValue(mockPayload);

      const result = await service.refresh(MOCK_REFRESHTOKEN);

      // El mapper debe recibir el token original como refresh token
      expect(mockAuthMapper.toLoginResponseDto).toHaveBeenCalledWith(
        MOCK_ACCESSTOKEN,
        MOCK_REFRESHTOKEN, // Usa el token ORIGINAL
        mockUsuarioResponseDto,
      );
      expect(result).toEqual(mockLoginResponseDto);
    });

    // CASO 3: Fallo en validarUsuarioExistente
    it('debe lanzar una excepción si el usuario del payload no existe', async () => {
      mockJwtService.refreshToken.mockReturnValue({
        accessToken: MOCK_ACCESSTOKEN,
      });
      mockJwtService.getPayload.mockReturnValue(mockPayload);
      const authError = new NotFoundException('Usuario no encontrado');
      mockAuthValidator.validarUsuarioExistente.mockRejectedValue(authError);

      await expect(service.refresh(MOCK_REFRESHTOKEN)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
