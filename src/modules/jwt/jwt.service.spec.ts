import { JwtService } from './jwt.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { Payload } from './interfaces/payload.interface';

// --- MOCKS DE DATOS Y AYUDAS ---

const MOCK_SECRET_AUTH = 'authSecret';
const MOCK_SECRET_REFRESH = 'refreshSecret';
const MOCK_ACCESS_TOKEN = 'mock.auth.token';
const MOCK_REFRESH_TOKEN = 'mock.refresh.token';
const MOCK_NEW_ACCESS_TOKEN = 'mock.new.auth.token';
const MOCK_NEW_REFRESH_TOKEN = 'mock.new.refresh.token';

const MOCK_PAYLOAD: Payload = {
  email: 'test@user.com',
  sub: 'user-id-123',
  exp: 0, // Será reescrito por Date mocks
  iat: 0, // Será reescrito por Date mocks
};

// --- MOCKS DE DEPENDENCIAS ---

const mockNestJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

describe('JwtService', () => {
  let service: JwtService;
  let nestJwtService: NestJwtService;

  // Guardamos la referencia a Date original
  const realDate = Date.now;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: NestJwtService,
          useValue: mockNestJwtService,
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
    nestJwtService = module.get<NestJwtService>(NestJwtService);

    jest.clearAllMocks();

    // Resetear mocks de sign para cada caso de prueba
    mockNestJwtService.sign.mockImplementation((payload, options) => {
      if (options.secret === MOCK_SECRET_AUTH) return MOCK_NEW_ACCESS_TOKEN;
      if (options.secret === MOCK_SECRET_REFRESH) return MOCK_NEW_REFRESH_TOKEN;
      return 'unknown.token';
    });

    // Mocks de Date para controlar la expiración
    Date.now = jest.fn(() => 1000 * 1000); // 1000 segundos después de la época
  });

  afterAll(() => {
    // Restaurar el objeto Date
    Date.now = realDate;
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  // ----------------------------------------------------------------
  // 1. Método generateToken()
  // ----------------------------------------------------------------
  describe('generateToken', () => {
    const payload = { email: 'user@test.com', sub: 'id-1' };

    it('debe generar un token de AUTH con la configuración correcta', () => {
      const token = service.generateToken(payload, 'auth');

      expect(nestJwtService.sign).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({ secret: MOCK_SECRET_AUTH, expiresIn: '1d' }),
      );
      expect(token).toBe(MOCK_NEW_ACCESS_TOKEN);
    });

    it('debe generar un token de REFRESH con la configuración correcta', () => {
      const token = service.generateToken(payload, 'refresh');

      expect(nestJwtService.sign).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          secret: MOCK_SECRET_REFRESH,
          expiresIn: '7d',
        }),
      );
      expect(token).toBe(MOCK_NEW_REFRESH_TOKEN);
    });
  });

  // ----------------------------------------------------------------
  // 2. Método getPayload()
  // ----------------------------------------------------------------
  describe('getPayload', () => {
    it('debe verificar el token AUTH y retornar el payload', () => {
      mockNestJwtService.verify.mockReturnValue(MOCK_PAYLOAD);

      const result = service.getPayload(MOCK_ACCESS_TOKEN, 'auth');

      expect(nestJwtService.verify).toHaveBeenCalledWith(MOCK_ACCESS_TOKEN, {
        secret: MOCK_SECRET_AUTH,
      });
      expect(result).toEqual(MOCK_PAYLOAD);
    });

    it('debe lanzar UnauthorizedException si la verificación del token AUTH falla', () => {
      mockNestJwtService.verify.mockImplementation(() => {
        throw new Error();
      });

      expect(() => service.getPayload(MOCK_ACCESS_TOKEN, 'auth')).toThrow(
        UnauthorizedException,
      );
      expect(() => service.getPayload(MOCK_REFRESH_TOKEN, 'refresh')).toThrow(
        UnauthorizedException,
      );
    });
  });

  // ----------------------------------------------------------------
  // 3. Método refreshToken()
  // ----------------------------------------------------------------
  describe('refreshToken', () => {
    // Configuración base del verify para este describe
    const mockVerifyRefresh = (exp: number) => {
      const payloadWithExp = { ...MOCK_PAYLOAD, exp };
      mockNestJwtService.verify.mockReturnValue(payloadWithExp);
      return payloadWithExp;
    };

    // --- CASOS DE ERROR ---

    it('debe lanzar UnauthorizedException si la verificación del token falla', () => {
      mockNestJwtService.verify.mockImplementation(() => {
        throw new Error();
      });

      expect(() => service.refreshToken(MOCK_REFRESH_TOKEN)).toThrow(
        UnauthorizedException,
      );
    });

    it('debe lanzar UnauthorizedException si el token verificado no tiene campo "exp"', () => {
      mockNestJwtService.verify.mockReturnValue({
        ...MOCK_PAYLOAD,
        exp: undefined,
      }); // Sin 'exp'

      expect(() => service.refreshToken(MOCK_REFRESH_TOKEN)).toThrow(
        UnauthorizedException,
      );
    });

    // --- CASOS DE ÉXITO ---

    // CASO 1: Token cerca de expirar (menos de 30 minutos)
    it('debe generar NUEVO AccessToken Y NUEVO RefreshToken si quedan MENOS de 30 min (timeToExpire < 30)', () => {
      // Configuramos el token para que expire en 29.99 minutos (1800 segundos)
      // current_time = 1000s. Expiración en: 1000s + (29.99 * 60) = 2799.4s
      const expirationSeconds = 1000 + 29.99 * 60;
      mockVerifyRefresh(Math.floor(expirationSeconds));

      const result = service.refreshToken(MOCK_REFRESH_TOKEN);

      // Se generan dos tokens
      expect(mockNestJwtService.sign).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        accessToken: MOCK_NEW_ACCESS_TOKEN,
        refreshToken: MOCK_NEW_REFRESH_TOKEN,
      });
    });

    // CASO 2: Token NO cerca de expirar (más de 30 minutos)
    it('debe generar SOLO un NUEVO AccessToken si quedan MAS de 30 min (timeToExpire >= 30)', () => {
      // Configuramos el token para que expire en 30.01 minutos (1800.6 segundos)
      // current_time = 1000s. Expiración en: 1000s + (30.01 * 60) = 2800.6s
      const expirationSeconds = 1000 + 30.01 * 60;
      mockVerifyRefresh(Math.floor(expirationSeconds));

      const result = service.refreshToken(MOCK_REFRESH_TOKEN);

      // Se genera solo un Access Token
      expect(mockNestJwtService.sign).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        accessToken: MOCK_NEW_ACCESS_TOKEN,
      });
      expect(result.refreshToken).toBeUndefined();
    });
  });
});
