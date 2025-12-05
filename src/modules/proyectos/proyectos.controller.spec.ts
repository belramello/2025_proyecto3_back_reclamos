import { Test, TestingModule } from '@nestjs/testing';
import { ProyectosController } from './proyectos.controller';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { Proyecto } from './schemas/proyecto.schema'; // Asumo que tienes este esquema

// --- MOCKS DE DATOS Y SERVICIOS ---

const MOCK_CLIENTE_ID = '60c84c47f897f212d4a1b0c0';
const MOCK_PROYECTO_ID = '60c84c47f897f212d4a1b0c1';

// 1. DTO de entrada para la creación
const mockCreateProyectoDto: CreateProyectoDto = {
  titulo: 'Proyecto Nuevo',
  descripcion: 'Descripción de prueba',
  fechaInicio: new Date().toISOString(),
  tipo: 'WEB',
  cliente: MOCK_CLIENTE_ID,
};

// 2. Mock de la entidad Proyecto de respuesta
const mockProyecto: Proyecto = {
  _id: MOCK_PROYECTO_ID,
  ...mockCreateProyectoDto,
} as any;

const mockProyectosList: Proyecto[] = [mockProyecto];

// 3. Mock del ProyectosService para aislar el controlador
const mockProyectosService = {
  create: jest.fn().mockResolvedValue(mockProyecto),
  findAll: jest.fn().mockResolvedValue(mockProyectosList),
  findAllByCliente: jest.fn().mockResolvedValue(mockProyectosList),
};

// --- SUITE DE TESTS ---

describe('ProyectosController', () => {
  let controller: ProyectosController;
  let service: ProyectosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProyectosController],
      providers: [
        {
          provide: ProyectosService,
          useValue: mockProyectosService,
        },
      ],
    }).compile();

    controller = module.get<ProyectosController>(ProyectosController);
    service = module.get<ProyectosService>(ProyectosService);
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  // ----------------------------------------------------------------
  // 1. POST /proyectos (create)
  // ----------------------------------------------------------------
  describe('create', () => {
    it('debe llamar a proyectosService.create con el DTO del cuerpo y retornar el proyecto creado', async () => {
      const result = await controller.create(mockCreateProyectoDto);

      // Verifica que el servicio fue llamado con el DTO completo
      expect(service.create).toHaveBeenCalledWith(mockCreateProyectoDto);
      expect(result).toEqual(mockProyecto);
    });
  });

  // ----------------------------------------------------------------
  // 2. GET /proyectos (findAll)
  // ----------------------------------------------------------------
  describe('findAll', () => {
    it('debe llamar a proyectosService.findAll y retornar la lista de proyectos', async () => {
      const result = await controller.findAll();

      // Verifica que el método del servicio fue llamado
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProyectosList);
    });
  });

  // ----------------------------------------------------------------
  // 3. GET /proyectos/cliente/:clienteId (findByCliente)
  // ----------------------------------------------------------------
  describe('findByCliente', () => {
    it('debe llamar a proyectosService.findAllByCliente con el parámetro ID de la URL y retornar la lista', async () => {
      const result = await controller.findByCliente(MOCK_CLIENTE_ID);

      // Verifica que el servicio fue llamado con el ID extraído del @Param
      expect(service.findAllByCliente).toHaveBeenCalledWith(MOCK_CLIENTE_ID);
      expect(result).toEqual(mockProyectosList);
    });
  });
});
