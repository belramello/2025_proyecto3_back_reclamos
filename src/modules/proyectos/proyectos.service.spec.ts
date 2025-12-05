import { Test, TestingModule } from '@nestjs/testing';
import { ProyectosService } from './proyectos.service';
import { ProyectosRepositoryInterface } from './repositories/proyectos-repository.interface';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { Proyecto } from './schemas/proyecto.schema'; // Asumo que tienes un esquema Proyecto

// --- MOCKS DE DATOS ---

const MOCK_CLIENTE_ID = '60c84c47f897f212d4a1b0c0';
const MOCK_PROYECTO_ID = '60c84c47f897f212d4a1b0c1';

// 1. DTO de entrada para la creación
const mockCreateProyectoDto: CreateProyectoDto = {
  titulo: 'Proyecto Demo',
  descripcion: 'Proyecto de prueba para testing',
  descripcionDetallada: 'Detalle opcional',
  fechaInicio: new Date().toISOString(),
  tipo: 'WEB',
  cliente: MOCK_CLIENTE_ID,
};

// 2. Mock de la entidad Proyecto (simulando la respuesta de la BD)
const mockProyecto: Proyecto = {
  _id: MOCK_PROYECTO_ID,
  ...mockCreateProyectoDto,
  // Agrega otros campos que pueda tener tu esquema Proyecto
  fechaCreacion: new Date(),
} as Proyecto;

const mockProyectosList: Proyecto[] = [
  mockProyecto,
  {
    ...mockProyecto,
    _id: '60c84c47f897f212d4a1b0c2',
    titulo: 'Otro Proyecto',
  } as Proyecto,
];

// --- MOCKS DE DEPENDENCIAS ---

// Mock para ProyectosRepositoryInterface
const mockProyectosRepository: ProyectosRepositoryInterface = {
  create: jest.fn().mockResolvedValue(mockProyecto),
  findAll: jest.fn().mockResolvedValue(mockProyectosList),
  findByCliente: jest.fn().mockResolvedValue(mockProyectosList),
};

describe('ProyectosService', () => {
  let service: ProyectosService;
  let repository: ProyectosRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectosService,
        {
          provide: 'ProyectosRepositoryInterface', // Token de inyección
          useValue: mockProyectosRepository,
        },
      ],
    }).compile();

    service = module.get<ProyectosService>(ProyectosService);
    repository = module.get<ProyectosRepositoryInterface>(
      'ProyectosRepositoryInterface',
    );

    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  // ----------------------------------------------------------------
  // 1. Método create()
  // ----------------------------------------------------------------
  describe('create', () => {
    it('debe llamar al repository.create con el DTO y retornar el nuevo proyecto', async () => {
      const result = await service.create(mockCreateProyectoDto);

      // Verificación de la llamada al repositorio
      expect(repository.create).toHaveBeenCalledWith(mockCreateProyectoDto);
      expect(repository.create).toHaveBeenCalledTimes(1);

      // Verificación de la respuesta
      expect(result).toEqual(mockProyecto);
    });
  });

  // ----------------------------------------------------------------
  // 2. Método findAll()
  // ----------------------------------------------------------------
  describe('findAll', () => {
    it('debe llamar al repository.findAll y retornar la lista de proyectos', async () => {
      const result = await service.findAll();

      // Verificación de la llamada al repositorio
      expect(repository.findAll).toHaveBeenCalledTimes(1);

      // Verificación de la respuesta
      expect(result).toEqual(mockProyectosList);
    });
  });

  // ----------------------------------------------------------------
  // 3. Método findAllByCliente()
  // ----------------------------------------------------------------
  describe('findAllByCliente', () => {
    it('debe llamar al repository.findByCliente con el ID del cliente y retornar la lista de proyectos', async () => {
      const result = await service.findAllByCliente(MOCK_CLIENTE_ID);

      // Verificación de la llamada al repositorio
      expect(repository.findByCliente).toHaveBeenCalledWith(MOCK_CLIENTE_ID);
      expect(repository.findByCliente).toHaveBeenCalledTimes(1);

      // Verificación de la respuesta
      expect(result).toEqual(mockProyectosList);
    });
  });
});
