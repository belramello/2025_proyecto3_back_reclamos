import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RespuestaUsuarioDto } from './dto/respuesta-usuario.dto';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';

// --- MOCKS DE DATOS Y SERVICIOS ---

const MOCK_ID = '60c84c47f897f212d4a1b0c0'; // ID válido de Mongo
const MOCK_EMAIL = 'test@example.com';

// Mock de la respuesta esperada del DTO
const mockResponseDto: RespuestaUsuarioDto = {
  id: MOCK_ID,
  nombreUsuario: 'testuser',
  email: MOCK_EMAIL,
  rol: { _id: 'rol-1', nombre: 'Cliente' } as any,
  nombre: 'Test',
  direccion: undefined,
  telefono: undefined,
  subarea: undefined,
  area: undefined,
};

// Mock de la entrada DTO
const mockCreateDto: CreateUsuarioDto = {
  nombreUsuario: 'newuser',
  email: 'new@example.com',
  contraseña: 'securepassword',
  rol: 'rol-1',
};

const mockUpdateDto: UpdateUsuarioDto = {
  nombre: 'Updated Name',
};

// Mock del UsuarioService para aislar el controlador
const mockUsuarioService = {
  createCliente: jest.fn().mockResolvedValue(mockResponseDto),
  create: jest.fn().mockResolvedValue(mockResponseDto),
  findAll: jest.fn().mockResolvedValue([mockResponseDto]),
  findOne: jest.fn().mockResolvedValue(mockResponseDto),
  update: jest.fn().mockResolvedValue(mockResponseDto),
  remove: jest.fn().mockResolvedValue(undefined),
};

// Mock del ParseMongoIdPipe
// No se mockea su lógica interna (que se prueba aparte), solo se asegura su uso.
const mockParseMongoIdPipe = new ParseMongoIdPipe();

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: UsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: mockUsuarioService,
        },
        // Nota: NestJS maneja automáticamente la inyección de Pipes en controladores.
        // Solo inyectamos aquí si tuviéramos que mockear o reemplazar el pipe.
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
    service = module.get<UsuarioService>(UsuarioService);
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  // ----------------------------------------------------------------
  // 1. POST /usuarios/registrar-cliente
  // ----------------------------------------------------------------
  describe('createCliente', () => {
    it('debe llamar a usuarioService.createCliente con el DTO y retornar el DTO de respuesta', async () => {
      const result = await controller.createCliente(mockCreateDto);

      expect(service.createCliente).toHaveBeenCalledWith(mockCreateDto);
      expect(result).toEqual(mockResponseDto);
    });
  });

  // ----------------------------------------------------------------
  // 2. POST /usuarios (Creación genérica)
  // ----------------------------------------------------------------
  describe('create', () => {
    it('debe llamar a usuarioService.create con el DTO y retornar el DTO de respuesta', async () => {
      const result = await controller.create(mockCreateDto);

      expect(service.create).toHaveBeenCalledWith(mockCreateDto);
      expect(result).toEqual(mockResponseDto);
    });
  });

  // ----------------------------------------------------------------
  // 3. GET /usuarios
  // ----------------------------------------------------------------
  describe('findAll', () => {
    it('debe llamar a usuarioService.findAll y retornar un array de DTOs', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockResponseDto]);
    });
  });

  // ----------------------------------------------------------------
  // 4. GET /usuarios/:id
  // ----------------------------------------------------------------
  describe('findOne', () => {
    it('debe llamar a usuarioService.findOne con el ID y retornar un DTO', async () => {
      const result = await controller.findOne(MOCK_ID);

      // Verificamos que se llama con el ID (asumiendo que el pipe ya lo validó)
      expect(service.findOne).toHaveBeenCalledWith(MOCK_ID);
      expect(result).toEqual(mockResponseDto);
    });

    // NOTA: La validación del formato Mongo ID (ParseMongoIdPipe) se testea
    // en la especificación del pipe, no aquí.
  });

  // ----------------------------------------------------------------
  // 5. PATCH /usuarios/:id
  // ----------------------------------------------------------------
  describe('update', () => {
    it('debe llamar a usuarioService.update con el ID y el DTO y retornar el DTO actualizado', async () => {
      const result = await controller.update(MOCK_ID, mockUpdateDto);

      expect(service.update).toHaveBeenCalledWith(MOCK_ID, mockUpdateDto);
      expect(result).toEqual(mockResponseDto);
    });
  });

  // ----------------------------------------------------------------
  // 6. DELETE /usuarios/:id
  // ----------------------------------------------------------------
  describe('remove', () => {
    it('debe llamar a usuarioService.remove con el ID y retornar void (o undefined)', async () => {
      const result = await controller.remove(MOCK_ID);

      expect(service.remove).toHaveBeenCalledWith(MOCK_ID);
      expect(result).toBeUndefined(); // Verifica el retorno void/204
    });
  });
});
