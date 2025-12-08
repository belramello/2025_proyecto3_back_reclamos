import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RespuestaFindAllPaginatedFeedbackDTO } from './dto/respuesta-find-all-paginated-dto';

// --- MOCKS DE DATOS Y SERVICIOS ---

const MOCK_RECLAMO_ID = '60c84c47f897f212d4a1b0c0';
const MOCK_CLIENTE_ID = '60c84c47f897f212d4a1b0c1';

// 1. DTOs de entrada
const mockCreateFeedbackDto: CreateFeedbackDto = {
  valoracion: 5,
  comentario: 'Great service',
  reclamo: MOCK_RECLAMO_ID,
  cliente: MOCK_CLIENTE_ID,
};

const mockPaginationDto: PaginationDto = {
  page: 2,
  limit: 10,
};

// 2. Mock de respuestas
const mockCreatedFeedbackResponse = { valoracion: 5, reclamo: MOCK_RECLAMO_ID };

const mockPaginatedResponse: RespuestaFindAllPaginatedFeedbackDTO = {
  feedback: [mockCreatedFeedbackResponse] as any,
  total: 10,
  page: 2,
  lastPage: 1,
};

// 3. Mock del FeedbackService para aislar el controlador
const mockFeedbackService = {
  create: jest.fn().mockResolvedValue(mockCreatedFeedbackResponse),
  findAll: jest.fn().mockResolvedValue(mockPaginatedResponse),
};

// --- SUITE DE TESTS ---

describe('FeedbackController', () => {
  let controller: FeedbackController;
  let service: FeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        {
          provide: FeedbackService,
          useValue: mockFeedbackService,
        },
      ],
    }).compile();

    controller = module.get<FeedbackController>(FeedbackController);
    service = module.get<FeedbackService>(FeedbackService);
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  // ----------------------------------------------------------------
  // 1. POST /feedback (create)
  // ----------------------------------------------------------------
  describe('create', () => {
    it('debe llamar a feedbackService.create con el DTO del cuerpo y retornar la respuesta', async () => {
      const result = await controller.create(mockCreateFeedbackDto);

      // Verifica que el servicio fue llamado con el DTO completo
      expect(service.create).toHaveBeenCalledWith(mockCreateFeedbackDto);
      expect(result).toEqual(mockCreatedFeedbackResponse);
    });
  });

  // ----------------------------------------------------------------
  // 2. GET /feedback (findAll)
  // ----------------------------------------------------------------
  describe('findAll', () => {
    it('debe llamar a feedbackService.findAll con los Query params (PaginationDto) y retornar la respuesta paginada', async () => {
      const result = await controller.findAll(mockPaginationDto as any); // Usamos 'as any' si PaginationDto no es idéntico a PaginationFeedbackDto

      // Verifica que el servicio fue llamado con los parámetros de paginación
      expect(service.findAll).toHaveBeenCalledWith(mockPaginationDto);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('debe llamar a feedbackService.findAll con valores vacíos si no hay query params', async () => {
      await controller.findAll({} as any);

      // Verifica que se llama con un objeto vacío (o valores por defecto si se usan)
      expect(service.findAll).toHaveBeenCalledWith({});
    });
  });
});
