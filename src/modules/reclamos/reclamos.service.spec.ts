import { Test, TestingModule } from '@nestjs/testing';
import { ReclamosService } from './reclamos.service';
import { IReclamosRepository } from './repositories/reclamos-repository.interface';
import { ReclamosValidator } from './helpers/reclamos-validator';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto';
import { Usuario } from '../usuario/schema/usuario.schema';
import { ReclamoDocumentType } from './schemas/reclamo.schema';
import { Area } from '../../../modules/areas/schemas/area.schema';
import { Subarea } from '../../../modules/subareas/schemas/subarea.schema';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

// --- MOCKS DE DATOS ---

const MOCK_RECLAMO_ID = '60c84c47f897f212d4a1b0c0';
const MOCK_EMPLEADO_ID = '60c84c47f897f212d4a1b0c1';
const MOCK_ENCARGADO_ID = '60c84c47f897f212d4a1b0c2';
const MOCK_SUBAREA_ID = '60c84c47f897f212d4a1b0c3';
const MOCK_AREA_ID = '60c84c47f897f212d4a1b0c4';

const mockCreateDto: CreateReclamoDto = {} as CreateReclamoDto;
const mockUpdateDto: UpdateReclamoDto = {} as UpdateReclamoDto;
const mockHistorial = [{ paso: 1 }, { paso: 2 }];

const mockArea: Area = { _id: MOCK_AREA_ID, nombre: 'IT' } as Area;
const mockSubarea: Subarea = {
  _id: MOCK_SUBAREA_ID,
  nombre: 'Frontend',
  area: mockArea,
} as Subarea;

// Mock de Usuario (Empleado)
const mockEmpleado: Usuario = {
  _id: MOCK_EMPLEADO_ID,
  nombreUsuario: 'empleado_test',
  subarea: mockSubarea,
  // Otras propiedades mínimas
} as Usuario;

// Mock de Usuario (Encargado)
const mockEncargado: Usuario = {
  _id: MOCK_ENCARGADO_ID,
  nombreUsuario: 'encargado_test',
  area: mockArea,
  // Otras propiedades mínimas
} as Usuario;

// Mock del Reclamo Documento
const mockReclamo: ReclamoDocumentType = {
  _id: MOCK_RECLAMO_ID,
  // Propiedades mínimas necesarias
} as ReclamoDocumentType;

// --- MOCKS DE DEPENDENCIAS ---

const mockReclamosRepository = {
  // Métodos simples
  findOne: jest.fn().mockResolvedValue(mockReclamo),
  findAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue(mockReclamo),
  update: jest.fn().mockResolvedValue('updated'),
  remove: jest.fn().mockResolvedValue(undefined),
  consultarHistorialReclamo: jest.fn().mockResolvedValue(mockHistorial),

  // Métodos complejos de asignación
  autoasignar: jest.fn().mockResolvedValue(undefined),
  asignarReclamoASubarea: jest.fn().mockResolvedValue(undefined),
  asignarReclamoAEmpleado: jest.fn().mockResolvedValue(undefined),
  reasignarReclamoAEmpleado: jest.fn().mockResolvedValue(undefined),
  reasignarReclamoASubarea: jest.fn().mockResolvedValue(undefined),
  reasignarReclamoAArea: jest.fn().mockResolvedValue(undefined),
};

const mockReclamosValidator = {
  // Métodos de validación
  // Se restablece a mockResolvedValue(mockReclamo) por defecto en beforeEach
  validateReclamoExistente: jest.fn().mockResolvedValue(mockReclamo),
  validateReclamoPendienteAAsignar: jest.fn().mockResolvedValue(undefined),
  validateAreaYSubareaReclamo: jest.fn().mockResolvedValue(mockSubarea),
  validateAreaReclamoParaEncargado: jest.fn().mockResolvedValue(mockArea),
  validateSubareaExistenteYValida: jest.fn().mockResolvedValue(mockSubarea),
  // Retorna [Subarea, Usuario]
  validateEmpleadoExistenteYValido: jest
    .fn()
    .mockResolvedValue([mockSubarea, mockEmpleado]),
  validateReclamoEnProceso: jest.fn().mockResolvedValue(undefined),
  validateEmpleadoAsignado: jest.fn().mockResolvedValue(undefined),
  // Retorna [Usuario, Subarea]
  validateEmpleadoExistenteYConSubarea: jest
    .fn()
    .mockResolvedValue([mockEmpleado, mockSubarea]),
  validateEmpleadoConSubarea: jest.fn().mockResolvedValue(mockSubarea),
  validateAreaExistente: jest.fn().mockResolvedValue(mockArea),
};

describe('ReclamosService', () => {
  let service: ReclamosService;
  let repository: IReclamosRepository;
  let validator: ReclamosValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReclamosService,
        {
          provide: 'IReclamosRepository',
          useValue: mockReclamosRepository,
        },
        // Usamos el token de la clase (aunque lleva forwardRef) para mockear el validator
        {
          provide: ReclamosValidator,
          useValue: mockReclamosValidator,
        },
      ],
    }).compile();

    service = module.get<ReclamosService>(ReclamosService);
    repository = module.get<IReclamosRepository>('IReclamosRepository');
    validator = module.get<ReclamosValidator>(ReclamosValidator);

    jest.clearAllMocks();

    // ** RESTABLECER EL MOCK DE VALIDATE RECLAMO EXISTENTE EN CADA TEST **
    // Esto previene que un error mockeado en una prueba afecte a todas las demás.
    mockReclamosValidator.validateReclamoExistente.mockResolvedValue(
      mockReclamo,
    );
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  // ----------------------------------------------------------------
  // Métodos Triviales (para cobertura)
  // ----------------------------------------------------------------
  describe('Trivial Methods', () => {
    it('create debe retornar el string de acción (dummy)', () => {
      expect(service.create(mockCreateDto)).toBe(
        'This action adds a new reclamo',
      );
    });

    it('findAll debe retornar el string de acción (dummy)', () => {
      expect(service.findAll()).toBe('This action returns all reclamos');
    });

    it('findOne debe llamar a repository.findOne', async () => {
      const result = await service.findOne(MOCK_RECLAMO_ID);
      expect(repository.findOne).toHaveBeenCalledWith(MOCK_RECLAMO_ID);
      expect(result).toEqual(mockReclamo);
    });

    it('update debe retornar el string de acción (dummy)', () => {
      expect(service.update(1, mockUpdateDto)).toBe(
        'This action updates a #1 reclamo',
      );
    });

    it('remove debe retornar el string de acción (dummy)', () => {
      expect(service.remove(1)).toBe('This action removes a #1 reclamo');
    });
  });

  // ----------------------------------------------------------------
  // 1. consultarHistorialReclamo()
  // ----------------------------------------------------------------
  describe('consultarHistorialReclamo', () => {
    it('debe validar la existencia y luego consultar el historial', async () => {
      const result = await service.consultarHistorialReclamo(MOCK_RECLAMO_ID);

      expect(validator.validateReclamoExistente).toHaveBeenCalledWith(
        MOCK_RECLAMO_ID,
      );
      expect(repository.consultarHistorialReclamo).toHaveBeenCalledWith(
        MOCK_RECLAMO_ID,
      );
      expect(result).toEqual(mockHistorial);
    });

    // ** CORRECCIÓN: Ahora solo prueba el caso de error **
    it('debe propagar NotFoundException si el validator falla', async () => {
      validator.validateReclamoExistente.mockRejectedValue(
        new NotFoundException(),
      );

      // CORREGIDO: Aserción sobre el método correcto
      await expect(
        service.consultarHistorialReclamo(MOCK_RECLAMO_ID),
      ).rejects.toThrow(NotFoundException);
      expect(repository.consultarHistorialReclamo).not.toHaveBeenCalled();
    });
  });

  // ----------------------------------------------------------------
  // 2. autoasignarReclamo()
  // ----------------------------------------------------------------
  describe('autoasignarReclamo', () => {
    it('debe validar existencia, estado y área/subárea, y luego llamar a repository.autoasignar', async () => {
      const result = await service.autoasignarReclamo(
        MOCK_RECLAMO_ID,
        mockEmpleado,
      );

      // Verificación de llamadas a Validator
      expect(validator.validateReclamoExistente).toHaveBeenCalledWith(
        MOCK_RECLAMO_ID,
      );
      expect(validator.validateReclamoPendienteAAsignar).toHaveBeenCalledWith(
        mockReclamo,
      );
      expect(validator.validateAreaYSubareaReclamo).toHaveBeenCalledWith(
        mockReclamo,
        mockEmpleado,
      );

      // Verificación de llamada a Repository
      expect(repository.autoasignar).toHaveBeenCalledWith(
        mockReclamo,
        mockEmpleado,
        mockSubarea, // subarea retornada por validateAreaYSubareaReclamo
      );
      expect(result).toBeUndefined();
    });
  });

  // ----------------------------------------------------------------
  // 3. asignarReclamoASubarea()
  // ----------------------------------------------------------------
  describe('asignarReclamoASubarea', () => {
    const comentario = 'Asignación de prueba';

    it('debe validar existencia, estado, encargado y subárea, y llamar a repository.asignarReclamoASubarea', async () => {
      const result = await service.asignarReclamoASubarea(
        MOCK_RECLAMO_ID,
        mockEncargado,
        MOCK_SUBAREA_ID,
        comentario,
      );

      // Verificación de llamadas a Validator
      expect(validator.validateReclamoExistente).toHaveBeenCalledWith(
        MOCK_RECLAMO_ID,
      );
      expect(validator.validateReclamoPendienteAAsignar).toHaveBeenCalledWith(
        mockReclamo,
      );
      expect(validator.validateAreaReclamoParaEncargado).toHaveBeenCalledWith(
        mockReclamo,
        mockEncargado,
      );
      expect(validator.validateSubareaExistenteYValida).toHaveBeenCalledWith(
        MOCK_SUBAREA_ID,
        mockArea,
      );

      // Verificación de llamada a Repository
      expect(repository.asignarReclamoASubarea).toHaveBeenCalledWith(
        mockReclamo,
        mockSubarea, // subarea retornada por validateSubareaExistenteYValida
        comentario,
      );
      expect(result).toBeUndefined();
    });
  });

  // ----------------------------------------------------------------
  // 4. asignarReclamoAEmpleado()
  // ----------------------------------------------------------------
  describe('asignarReclamoAEmpleado', () => {
    const comentario = 'Asignación a empleado específica';

    it('debe validar existencia, estado, encargado y empleado, y llamar a repository.asignarReclamoAEmpleado', async () => {
      // Configuramos el mock para que retorne el array [subarea, empleado]
      mockReclamosValidator.validateEmpleadoExistenteYValido.mockResolvedValue([
        mockSubarea,
        mockEmpleado,
      ]);

      const result = await service.asignarReclamoAEmpleado(
        MOCK_RECLAMO_ID,
        mockEncargado,
        MOCK_EMPLEADO_ID,
        comentario,
      );

      // Verificación de llamadas a Validator
      expect(validator.validateAreaReclamoParaEncargado).toHaveBeenCalledWith(
        mockReclamo,
        mockEncargado,
      );
      expect(validator.validateEmpleadoExistenteYValido).toHaveBeenCalledWith(
        MOCK_EMPLEADO_ID,
        mockArea,
      );

      // Verificación de llamada a Repository
      expect(repository.asignarReclamoAEmpleado).toHaveBeenCalledWith(
        mockReclamo,
        mockEncargado,
        mockSubarea, // subarea retornada por validateEmpleadoExistenteYValido
        mockEmpleado, // empleado retornado por validateEmpleadoExistenteYValido
        comentario,
      );
      expect(result).toBeUndefined();
    });
  });

  // ----------------------------------------------------------------
  // 5. reasignarReclamoAEmpleado()
  // ----------------------------------------------------------------
  describe('reasignarReclamoAEmpleado', () => {
    const empleadoDestino = { ...mockEmpleado, _id: 'emp-dest-id' } as Usuario;
    const comentario = 'Reasignación a otro empleado';

    it('debe validar existencia, estado "en proceso", empleado asignado, empleado destino y llamar a repository.reasignarReclamoAEmpleado', async () => {
      // Configuramos el mock para que retorne el array [empleado, subarea]
      mockReclamosValidator.validateEmpleadoExistenteYConSubarea.mockResolvedValue(
        [empleadoDestino, mockSubarea],
      );

      const result = await service.reasignarReclamoAEmpleado(
        MOCK_RECLAMO_ID,
        mockEmpleado,
        empleadoDestino._id as string,
        comentario,
      );

      // Verificación de llamadas a Validator
      expect(validator.validateReclamoEnProceso).toHaveBeenCalledWith(
        mockReclamo,
      );
      expect(validator.validateEmpleadoAsignado).toHaveBeenCalledWith(
        mockReclamo,
        mockEmpleado,
      );
      expect(
        validator.validateEmpleadoExistenteYConSubarea,
      ).toHaveBeenCalledWith(empleadoDestino._id, mockEmpleado);

      // Verificación de llamada a Repository
      expect(repository.reasignarReclamoAEmpleado).toHaveBeenCalledWith(
        mockReclamo,
        mockEmpleado, // Origen
        empleadoDestino, // Destino
        mockSubarea, // subarea retornada por validateEmpleadoExistenteYConSubarea
        comentario,
      );
      expect(result).toBeUndefined();
    });
  });

  // ----------------------------------------------------------------
  // 6. reasignarReclamoASubarea()
  // ----------------------------------------------------------------
  describe('reasignarReclamoASubarea', () => {
    const subareaDestino = {
      _id: 'sa-dest-id',
      nombre: 'Backend',
      area: mockArea,
    } as Subarea;
    const comentario = 'Reasignación a otra subárea';

    it('debe validar existencia, estado "en proceso", subáreas y llamar a repository.reasignarReclamoASubarea', async () => {
      // Configuramos los mocks para la subárea de origen y destino
      mockReclamosValidator.validateEmpleadoConSubarea.mockResolvedValue(
        mockSubarea,
      ); // Origen
      mockReclamosValidator.validateSubareaExistenteYValida.mockResolvedValue(
        subareaDestino,
      ); // Destino

      const result = await service.reasignarReclamoASubarea(
        MOCK_RECLAMO_ID,
        mockEmpleado,
        subareaDestino._id as string,
        comentario,
      );

      // Verificación de llamadas a Validator
      expect(validator.validateReclamoEnProceso).toHaveBeenCalledWith(
        mockReclamo,
      );
      expect(validator.validateEmpleadoConSubarea).toHaveBeenCalledWith(
        mockEmpleado,
      );
      expect(validator.validateEmpleadoAsignado).toHaveBeenCalledWith(
        mockReclamo,
        mockEmpleado,
      );
      // La validación de subárea debe usar el área de la subárea origen
      expect(validator.validateSubareaExistenteYValida).toHaveBeenCalledWith(
        subareaDestino._id,
        mockSubarea.area,
      );

      // Verificación de llamada a Repository
      expect(repository.reasignarReclamoASubarea).toHaveBeenCalledWith(
        mockReclamo,
        mockEmpleado,
        mockSubarea, // Subárea Origen
        subareaDestino, // Subárea Destino
        comentario,
      );
      expect(result).toBeUndefined();
    });
  });

  // ----------------------------------------------------------------
  // 7. reasignarReclamoAArea()
  // ----------------------------------------------------------------
  describe('reasignarReclamoAArea', () => {
    const areaDestino = { _id: 'area-dest-id', nombre: 'Ventas' } as Area;
    const comentario = 'Reasignación a otra área';

    it('debe validar existencia, estado "en proceso", subárea origen, área destino y llamar a repository.reasignarReclamoAArea', async () => {
      // Configuramos los mocks para la subárea de origen y área destino
      mockReclamosValidator.validateEmpleadoConSubarea.mockResolvedValue(
        mockSubarea,
      ); // Origen
      mockReclamosValidator.validateAreaExistente.mockResolvedValue(
        areaDestino,
      ); // Destino

      const result = await service.reasignarReclamoAArea(
        MOCK_RECLAMO_ID,
        mockEmpleado,
        areaDestino._id as string,
        comentario,
      );

      // Verificación de llamadas a Validator
      expect(validator.validateReclamoEnProceso).toHaveBeenCalledWith(
        mockReclamo,
      );
      expect(validator.validateEmpleadoConSubarea).toHaveBeenCalledWith(
        mockEmpleado,
      );
      expect(validator.validateEmpleadoAsignado).toHaveBeenCalledWith(
        mockReclamo,
        mockEmpleado,
      );
      expect(validator.validateAreaExistente).toHaveBeenCalledWith(
        areaDestino._id,
      );

      // Verificación de llamada a Repository
      expect(repository.reasignarReclamoAArea).toHaveBeenCalledWith(
        mockReclamo,
        mockEmpleado,
        mockSubarea, // Subárea Origen
        areaDestino, // Área Destino
        comentario,
      );
      expect(result).toBeUndefined();
    });
  });
});
