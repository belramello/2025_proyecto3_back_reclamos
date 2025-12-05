// Corregido: Agregando las importaciones faltantes de los servicios que se mockean en el Validator
import { ReclamosService } from '../reclamos/reclamos.service';
import { UsuarioService } from '../../modules/usuario/usuario.service'; // <-- ¡AGREGAR ESTA LÍNEA!
import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { IFeedbackRepository } from './repository/feedback-repository.interface';
import { FeedbackValidator } from './helpers/feedback-validator';
import { FeedbackMapper } from './mappers/feedback-mapper';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { PaginationFeedbackDto } from './dto/pagination-feedback.dto';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose'; // Necesaria para el test de ObjectId

// --- MOCKS DE DATOS ---

const MOCK_RECLAMO_ID = '60c84c47f897f212d4a1b0c0';
const MOCK_CLIENTE_ID = '60c84c47f897f212d4a1b0c1';

const mockCreateDto: CreateFeedbackDto = {
  valoracion: 5,
  comentario: 'Excelente servicio.',
  reclamo: MOCK_RECLAMO_ID,
  cliente: MOCK_CLIENTE_ID,
};

const mockPaginationDto: PaginationFeedbackDto = {
  page: 2,
  limit: 5,
};

// Mock de la entidad devuelta por el Repository (similar al documento DB)
const mockFeedbackDocument = {
  valoracion: 5,
  comentario: 'Excelente servicio.',
  reclamo: { nroTicket: 'R123', descripcion: 'Issue', ultimoHistorialEstado: 'CERRADO' },
  cliente: { nombre: 'Cliente Test', email: 'c@test.com' },
  fechaCreacion: new Date(),
};

// Mock de la respuesta de paginación del Repository
const mockPaginatedRepoResponse = {
  feedback: [mockFeedbackDocument, mockFeedbackDocument],
  total: 15,
  page: 2,
  lastPage: 3,
};

// Mock de la respuesta final del DTO (para verificar la llamada al mapper)
const mockRespuestaPaginatedDto = {
  feedback: [{ valoracion: 5, reclamo: { nroTicket: 'R123' } }],
  total: 15,
  page: 2,
  lastPage: 3,
};

// --- MOCKS DE DEPENDENCIAS DE SERVICE ---

const mockFeedbackRepository = {
  createFeedback: jest.fn().mockResolvedValue(mockFeedbackDocument),
  findAllPaginated: jest.fn().mockResolvedValue(mockPaginatedRepoResponse),
  findByReclamoYCliente: jest.fn(),
};

const mockFeedbackValidator = {
  validateCreateFeedback: jest.fn().mockResolvedValue(true),
};

const mockFeedbackMapper = {
  toRespuestaCreateFeedback: jest.fn().mockReturnValue({ valoracion: 5 }),
  toRespuestaFindAllPaginatedFeedbackDto: jest.fn().mockReturnValue(mockRespuestaPaginatedDto),
};


describe('FeedbackService', () => {
  let service: FeedbackService;
  let repository: IFeedbackRepository;
  let validator: FeedbackValidator;
  let mapper: FeedbackMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        // Proporcionamos el token Inject('IFeedbackRepository')
        {
          provide: 'IFeedbackRepository',
          useValue: mockFeedbackRepository,
        },
        // Proporcionamos el token forwardRef(() => FeedbackValidator)
        {
          provide: FeedbackValidator,
          useValue: mockFeedbackValidator,
        },
        {
          provide: FeedbackMapper,
          useValue: mockFeedbackMapper,
        },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
    repository = module.get<IFeedbackRepository>('IFeedbackRepository');
    validator = module.get<FeedbackValidator>(FeedbackValidator);
    mapper = module.get<FeedbackMapper>(FeedbackMapper);
    
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  // ----------------------------------------------------------------
  // 1. Método create()
  // ----------------------------------------------------------------
  describe('create', () => {
    it('debe llamar al validador, crear el feedback y mapear la respuesta (ÉXITO)', async () => {
      
      const result = await service.create(mockCreateDto);

      // 1. Verificación del validador
      expect(validator.validateCreateFeedback).toHaveBeenCalledWith(
        mockCreateDto.reclamo,
        mockCreateDto.cliente,
      );

      // 2. Verificación del repositorio
      expect(repository.createFeedback).toHaveBeenCalledWith(mockCreateDto);

      // 3. Verificación del mapper
      expect(mapper.toRespuestaCreateFeedback).toHaveBeenCalledWith(
        mockFeedbackDocument,
      );

      // 4. Resultado esperado
      expect(result).toEqual({ valoracion: 5 }); // Basado en mockMapper
    });

    // TEST DE PROPAGACIÓN DE ERRORES (Cubre el 100% de la lógica del service)
    it('debe propagar errores si la validación falla (ej. Reclamo no existe)', async () => {
      // Mockeamos la validación para que falle
      mockFeedbackValidator.validateCreateFeedback.mockRejectedValueOnce(
        new NotFoundException('El reclamo con ID no existe'),
      );

      await expect(service.create(mockCreateDto)).rejects.toThrow(
        NotFoundException,
      );
      
      // Aseguramos que el repositorio no se llama si la validación falla
      expect(repository.createFeedback).not.toHaveBeenCalled();
    });
  });

  // ----------------------------------------------------------------
  // 2. Método findAll()
  // ----------------------------------------------------------------
  describe('findAll', () => {
    // CASO 1: Paginación con valores definidos
    it('debe llamar al repositorio con limit/page correctos y mapear la respuesta', async () => {
      
      const result = await service.findAll(mockPaginationDto);

      // 1. Verificación del repositorio (usa los valores del DTO)
      expect(repository.findAllPaginated).toHaveBeenCalledWith(
        mockPaginationDto.page,
        mockPaginationDto.limit,
      );

      // 2. Verificación del mapper
      expect(mapper.toRespuestaFindAllPaginatedFeedbackDto).toHaveBeenCalledWith(
        mockPaginatedRepoResponse,
      );

      // 3. Resultado esperado
      expect(result).toEqual(mockRespuestaPaginatedDto);
    });

    // CASO 2: Paginación con valores por defecto
    it('debe llamar al repositorio con limit=10 y page=1 si no se provee DTO', async () => {
      
      // Llamamos con un DTO vacío o undefined
      await service.findAll({}); 

      // Verificación de valores por defecto
      expect(repository.findAllPaginated).toHaveBeenCalledWith(1, 10);
    });
  });
});

// ----------------------------------------------------------------
// 3. FeedbackValidator - Validación de la lógica de negocio
// ----------------------------------------------------------------
// NOTE: ReclamosService y UsuarioService ya deben estar importados arriba
describe('FeedbackValidator', () => {
    let validator: FeedbackValidator;
    
    // Mocks de dependencias del Validator
    const mockReclamosService = {
        findOne: jest.fn(),
    };
    const mockUsuariosService = {
        findOne: jest.fn(),
    };
    const mockFeedbackRepositoryForValidator = {
        findByReclamoYCliente: jest.fn(),
    };

    // Datos de prueba para el Reclamo (con el cliente poblado, como lo espera el validator)
    const MOCK_RECLAMO_POBLADO: any = {
        _id: MOCK_RECLAMO_ID,
        proyecto: {
            cliente: { 
                _id: MOCK_CLIENTE_ID, 
                nombre: 'Cliente' 
            }
        }
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FeedbackValidator,
                { provide: 'IFeedbackRepository', useValue: mockFeedbackRepositoryForValidator },
                // Las clases ReclamosService y UsuarioService DEBEN ESTAR IMPORTADAS
                { provide: ReclamosService, useValue: mockReclamosService },
                { provide: UsuarioService, useValue: mockUsuariosService },
            ],
        }).compile();

        validator = module.get<FeedbackValidator>(FeedbackValidator);
        
        jest.clearAllMocks();
        // Configuraciones base de éxito
        mockReclamosService.findOne.mockResolvedValue(MOCK_RECLAMO_POBLADO);
        mockUsuariosService.findOne.mockResolvedValue({ _id: MOCK_CLIENTE_ID });
        mockFeedbackRepositoryForValidator.findByReclamoYCliente.mockResolvedValue(null);
    });
    
    // ----------------------------------------------------------------
    // 3.1. validateCreateFeedback (Método de control)
    // ----------------------------------------------------------------
    describe('validateCreateFeedback', () => {
        it('debe pasar si todas las validaciones son exitosas', async () => {
            const result = await validator.validateCreateFeedback(MOCK_RECLAMO_ID, MOCK_CLIENTE_ID);
            expect(mockReclamosService.findOne).toHaveBeenCalled();
            expect(mockUsuariosService.findOne).toHaveBeenCalled();
            expect(mockFeedbackRepositoryForValidator.findByReclamoYCliente).toHaveBeenCalled();
            expect(result).toEqual(MOCK_RECLAMO_POBLADO);
        });
    });

    // ----------------------------------------------------------------
    // 3.2. validateReclamoExistente
    // ----------------------------------------------------------------
    describe('validateReclamoExistente', () => {
        it('debe lanzar NotFoundException si el reclamo no existe', async () => {
            mockReclamosService.findOne.mockResolvedValue(null);
            await expect(validator.validateReclamoExistente(MOCK_RECLAMO_ID)).rejects.toThrow(NotFoundException);
        });
    });

    // ----------------------------------------------------------------
    // 3.3. validateUsuarioExistente
    // ----------------------------------------------------------------
    describe('validateUsuarioExistente', () => {
        it('debe lanzar NotFoundException si el usuario no existe', async () => {
            mockUsuariosService.findOne.mockResolvedValue(null);
            await expect(validator.validateUsuarioExistente(MOCK_CLIENTE_ID)).rejects.toThrow(NotFoundException);
        });
    });

    // ----------------------------------------------------------------
    // 3.4. validateUsuarioEsCliente
    // ----------------------------------------------------------------
    describe('validateUsuarioEsCliente', () => {
        it('debe pasar si el ID del usuario coincide con el ID del cliente del reclamo', () => {
            // El mock MOCK_RECLAMO_POBLADO ya está configurado correctamente
            expect(() => validator.validateUsuarioEsCliente(MOCK_RECLAMO_POBLADO, MOCK_CLIENTE_ID)).not.toThrow();
        });

        it('debe lanzar BadRequestException si el reclamo no contiene proyecto', () => {
            const reclamoSinProyecto = {};
            expect(() => validator.validateUsuarioEsCliente(reclamoSinProyecto, MOCK_CLIENTE_ID)).toThrow(BadRequestException);
        });

        it('debe lanzar BadRequestException si el proyecto no contiene cliente', () => {
            const reclamoSinCliente = { proyecto: {} };
            expect(() => validator.validateUsuarioEsCliente(reclamoSinCliente, MOCK_CLIENTE_ID)).toThrow(BadRequestException);
        });

        it('debe lanzar BadRequestException si el cliente no está poblado (es un ObjectId)', () => {
            const reclamoClienteNoPoblado = { 
                proyecto: { 
                    // No hay necesidad de importar Types, ya está importado arriba
                    cliente: new Types.ObjectId() // Instancia de ObjectId
                } 
            };
            expect(() => validator.validateUsuarioEsCliente(reclamoClienteNoPoblado, MOCK_CLIENTE_ID)).toThrow(BadRequestException);
        });

        it('debe lanzar UnauthorizedException si el usuario NO es el cliente del reclamo', () => {
            const OTRO_CLIENTE_ID = '999999999999999999999999';
            expect(() => validator.validateUsuarioEsCliente(MOCK_RECLAMO_POBLADO, OTRO_CLIENTE_ID)).toThrow(UnauthorizedException);
        });
    });

    // ----------------------------------------------------------------
    // 3.5. validateNoFeedbackDuplicado
    // ----------------------------------------------------------------
    describe('validateNoFeedbackDuplicado', () => {
        it('debe lanzar BadRequestException si ya existe un feedback previo', async () => {
            mockFeedbackRepositoryForValidator.findByReclamoYCliente.mockResolvedValue(MOCK_RECLAMO_POBLADO); // Devuelve un existente
            await expect(validator.validateNoFeedbackDuplicado(MOCK_RECLAMO_ID, MOCK_CLIENTE_ID)).rejects.toThrow(BadRequestException);
        });
        
        it('debe pasar si no existe feedback previo', async () => {
            mockFeedbackRepositoryForValidator.findByReclamoYCliente.mockResolvedValue(null);
            await expect(validator.validateNoFeedbackDuplicado(MOCK_RECLAMO_ID, MOCK_CLIENTE_ID)).resolves.toBeUndefined();
        });
    });
});