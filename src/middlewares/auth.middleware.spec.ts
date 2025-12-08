import { AuthGuard, RequestWithUsuario } from './auth.middleware';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '../modules/jwt/jwt.service';
import { UsuarioService } from '../modules/usuario/usuario.service';
import { UsuarioDocumentType } from '../modules/usuario/schema/usuario.schema';
import { Payload } from '../modules/jwt/interfaces/payload.interface'; // Ajusta la ruta si es necesario

// --- MOCKS DE DATOS ---

const MOCK_USER_ID = '60c84c47f897f212d4a1b0c0';
const MOCK_TOKEN = 'Bearer valid.jwt.token';

const mockUsuarioDB: UsuarioDocumentType = {
  _id: MOCK_USER_ID,
  nombreUsuario: 'test_user',
} as UsuarioDocumentType;

const mockPayload: Payload = {
  sub: MOCK_USER_ID,
  email: 'test@example.com',
  // Otros campos necesarios
};

// --- MOCKS DE DEPENDENCIAS ---

const mockJwtService = {
  getPayload: jest.fn(),
};

const mockUsuarioService = {
  findOneForAuth: jest.fn(),
};

// --- MOCK DE CONTEXTO DE EJECUCIÓN (ExecutionContext) ---
const createMockContext = (
  token: string | null = MOCK_TOKEN,
): ExecutionContext => ({
  switchToHttp: () => ({
    getRequest: () =>
      ({
        headers: { authorization: token },
        // Aquí simulamos la interfaz RequestWithUsuario (aunque inicialmente no tenga 'usuario')
      }) as unknown as RequestWithUsuario,
    getResponse: jest.fn(),
    getNext: jest.fn(),
  }),
  getArgs: jest.fn(),
  getClass: jest.fn(),
  getHandler: jest.fn(),
  getType: jest.fn(),
});

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let usuarioService: UsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsuarioService, useValue: mockUsuarioService },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    usuarioService = module.get<UsuarioService>(UsuarioService);

    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(guard).toBeDefined();
  });

  // ----------------------------------------------------------------
  // 2. CASOS DE FALLO (Lógica dentro del try)
  // ----------------------------------------------------------------

  // 2.1. Token no existe (Coincide con la primera rama del if: if (!token))
  it('debe lanzar UnauthorizedException si no hay token en los headers', async () => {
    const context = createMockContext(null); // Sin token

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockJwtService.getPayload).not.toHaveBeenCalled();
  });

  // 2.2. Token inválido/expirado (Coincide con la segunda rama del if: if (!payload))
  it('debe lanzar UnauthorizedException si el token es inválido (getPayload retorna null/falsy)', async () => {
    mockJwtService.getPayload.mockReturnValue(null);

    await expect(guard.canActivate(createMockContext())).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockJwtService.getPayload).toHaveBeenCalled();
    expect(mockUsuarioService.findOneForAuth).not.toHaveBeenCalled();
  });

  // 2.3. Payload sin 'sub' (Coincide con la tercera rama del if: if (!payload.sub))
  it('debe lanzar UnauthorizedException si el payload no contiene el sub (ID)', async () => {
    const invalidPayload = { email: 'e@e.com' }; // Falta 'sub'
    mockJwtService.getPayload.mockReturnValue(invalidPayload);

    await expect(guard.canActivate(createMockContext())).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockUsuarioService.findOneForAuth).not.toHaveBeenCalled();
  });

  // 2.4. Usuario no encontrado (Coincide con la cuarta rama del if: if (!usuario))
  it('debe lanzar UnauthorizedException si el usuario no existe en la BD', async () => {
    mockJwtService.getPayload.mockReturnValue(mockPayload);
    mockUsuarioService.findOneForAuth.mockResolvedValue(null); // Usuario no existe

    await expect(guard.canActivate(createMockContext())).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockUsuarioService.findOneForAuth).toHaveBeenCalledWith(
      MOCK_USER_ID,
    );
  });

  // ----------------------------------------------------------------
  // 3. CASO DE FALLO (Lanzado desde el catch)
  // ----------------------------------------------------------------
  // Esto cubre la última rama, el catch(error), que lanza 'No autorizado'
  it('debe lanzar una UnauthorizedException genérica si ocurre cualquier error no manejado', async () => {
    // Simulamos un error en la verificación del token (ej: JwtService falla)
    mockJwtService.getPayload.mockImplementation(() => {
      throw new Error('Internal JWT error');
    });

    await expect(guard.canActivate(createMockContext())).rejects.toThrow(
      UnauthorizedException,
    );
    // Verificamos que el mensaje es el genérico 'No autorizado' del catch
    await expect(guard.canActivate(createMockContext())).rejects.toThrow(
      'No autorizado',
    );
  });
});
