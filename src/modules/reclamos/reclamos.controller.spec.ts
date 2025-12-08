import { Test, TestingModule } from '@nestjs/testing';
import { ReclamosController } from './reclamos.controller';
import { ReclamosService } from './reclamos.service';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';
import { EmpleadoAASignarDto } from './dto/empleado-a-asignar.dto';
import { SubareaAAsignarDto } from './dto/subarea-a-asignar.dto';
import { AreaAAsignarDto } from './dto/area-a-asignar.dto';
import { Usuario } from '../usuario/schema/usuario.schema';
import { AuthGuard } from '../../middlewares/auth.middleware'; // <-- IMPORTACIÓN NECESARIA
import { PermisoRequerido } from '../../common/decorators/permiso-requerido.decorator'; // Importación para mockear
import { PermisosEnum } from '../permisos/enums/permisos-enum'; // Importación para mockear

// --- MOCKS DE DATOS ---

const MOCK_RECLAMO_ID_MONGO = '60c84c47f897f212d4a1b0c0';
const MOCK_RECLAMO_ID_NUM = 1; // Para métodos con ID numérico (update, remove)
const MOCK_EMPLEADO_ID = '60c84c47f897f212d4a1b0c1';
const MOCK_SUBAREA_ID = '60c84c47f897f212d4a1b0c2';
const MOCK_AREA_ID = '60c84c47f897f212d4a1b0c3';

const mockCreateDto: CreateReclamoDto = {} as CreateReclamoDto;
const mockUpdateDto: UpdateReclamoDto = {} as UpdateReclamoDto;

const mockUsuario: Usuario = {
  _id: 'user-auth-id',
  nombreUsuario: 'empleado_test',
} as Usuario;

const mockEmpleadoAAsignarDto: EmpleadoAASignarDto = {
  empleadoId: MOCK_EMPLEADO_ID,
  comentario: 'Test comentario empleado',
};

const mockSubareaAAsignarDto: SubareaAAsignarDto = {
  subareaId: MOCK_SUBAREA_ID,
  comentario: 'Test comentario subarea',
};

const mockAreaAAsignarDto: AreaAAsignarDto = {
  areaId: MOCK_AREA_ID,
  comentario: 'Test comentario area',
};

const mockReclamosServiceResponse = { message: 'Operación exitosa' };

// --- MOCKS DE DEPENDENCIAS ---

const mockReclamosService = {
  create: jest.fn().mockResolvedValue(mockReclamosServiceResponse),
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(mockReclamosServiceResponse),
  consultarHistorialReclamo: jest.fn().mockResolvedValue({ historial: [] }),
  update: jest.fn().mockResolvedValue('updated'),
  remove: jest.fn().mockResolvedValue('removed'),
  autoasignarReclamo: jest.fn().mockResolvedValue(mockReclamosServiceResponse),
  asignarReclamoASubarea: jest
    .fn()
    .mockResolvedValue(mockReclamosServiceResponse),
  asignarReclamoAEmpleado: jest
    .fn()
    .mockResolvedValue(mockReclamosServiceResponse),
  reasignarReclamoAEmpleado: jest
    .fn()
    .mockResolvedValue(mockReclamosServiceResponse),
  reasignarReclamoASubarea: jest
    .fn()
    .mockResolvedValue(mockReclamosServiceResponse),
  reasignarReclamoAArea: jest
    .fn()
    .mockResolvedValue(mockReclamosServiceResponse),
};

// Simulación de Request con Usuario
const mockRequest = {
  usuario: mockUsuario,
} as unknown as RequestWithUsuario; // Asegúrate de que RequestWithUsuario esté disponible

describe('ReclamosController', () => {
  let controller: ReclamosController;
  let service: ReclamosService;

  beforeEach(async () => {
    // Definimos un mock para el AuthGuard que siempre retorna true
    class MockAuthGuard {
      canActivate = jest.fn().mockReturnValue(true);
    }

    // El decorador @PermisoRequerido también puede tener dependencias,
    // pero usualmente solo se testea su funcionalidad en el nivel de Guard
    // (si fuera un Guard). Aquí lo tratamos como un Decorator que no interfiere
    // con la inicialización.

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReclamosController],
      providers: [
        {
          provide: ReclamosService,
          useValue: mockReclamosService,
        },
        // Mocks para Pipes y Guards que se usan en los parámetros/métodos:
        ParseMongoIdPipe, // Lo dejamos para que Nest lo use, o se podría mockear si fuera complejo
      ],
    })
      // 💥 APLICAMOS EL MOCK DE GUARD A NIVEL GLOBAL DE LA PRUEBA 💥
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<ReclamosController>(ReclamosController);
    service = module.get<ReclamosService>(ReclamosService);
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  // ----------------------------------------------------------------
  // Métodos Simples (No requieren Guard)
  // ----------------------------------------------------------------

  describe('create', () => {
    it('debe llamar a service.create con el DTO', async () => {
      await controller.create(mockCreateDto);
      expect(service.create).toHaveBeenCalledWith(mockCreateDto);
    });
  });

  describe('findAll', () => {
    it('debe llamar a service.findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('debe llamar a service.findOne con el ID', async () => {
      await controller.findOne(MOCK_RECLAMO_ID_MONGO);
      expect(service.findOne).toHaveBeenCalledWith(MOCK_RECLAMO_ID_MONGO);
    });
  });

  describe('update', () => {
    it('debe llamar a service.update con ID numérico y DTO', async () => {
      await controller.update(String(MOCK_RECLAMO_ID_NUM), mockUpdateDto);
      expect(service.update).toHaveBeenCalledWith(
        MOCK_RECLAMO_ID_NUM,
        mockUpdateDto,
      );
    });
  });

  describe('remove', () => {
    it('debe llamar a service.remove con ID numérico', async () => {
      await controller.remove(String(MOCK_RECLAMO_ID_NUM));
      expect(service.remove).toHaveBeenCalledWith(MOCK_RECLAMO_ID_NUM);
    });
  });

  // ----------------------------------------------------------------
  // Métodos Protegidos (Requieren Guard/Usuario)
  // ----------------------------------------------------------------

  describe('consultarHistorialReclamo', () => {
    it('debe llamar a service.consultarHistorialReclamo con el ID', async () => {
      await controller.consultarHistorialReclamo(MOCK_RECLAMO_ID_MONGO);
      expect(service.consultarHistorialReclamo).toHaveBeenCalledWith(
        MOCK_RECLAMO_ID_MONGO,
      );
    });
  });

  describe('autoasignarReclamo', () => {
    it('debe llamar a service.autoasignarReclamo con ID y req.usuario', async () => {
      await controller.autoasignarReclamo(MOCK_RECLAMO_ID_MONGO, mockRequest);
      expect(service.autoasignarReclamo).toHaveBeenCalledWith(
        MOCK_RECLAMO_ID_MONGO,
        mockUsuario,
      );
    });
  });

  describe('asignarReclamoASubarea', () => {
    it('debe extraer el subareaId y comentario del Body y pasarlo al service', async () => {
      await controller.asignarReclamoASubarea(
        MOCK_RECLAMO_ID_MONGO,
        mockRequest,
        mockSubareaAAsignarDto,
      );

      expect(service.asignarReclamoASubarea).toHaveBeenCalledWith(
        MOCK_RECLAMO_ID_MONGO,
        mockUsuario,
        mockSubareaAAsignarDto.subareaId,
        mockSubareaAAsignarDto.comentario,
      );
    });
  });

  describe('asignarReclamoAEmpleado', () => {
    it('debe extraer el empleadoId del Body y pasarlo al service', async () => {
      await controller.asignarReclamoAEmpleado(
        MOCK_RECLAMO_ID_MONGO,
        mockRequest,
        mockEmpleadoAAsignarDto,
      );

      // Verificamos que se llama con los 3 argumentos (ID, Usuario, Empleado ID)
      expect(service.asignarReclamoAEmpleado).toHaveBeenCalledWith(
        MOCK_RECLAMO_ID_MONGO,
        mockUsuario,
        mockEmpleadoAAsignarDto.empleadoId,
      );
    });
  });

  describe('reasignacionReclamoAEmpleado', () => {
    it('debe extraer el empleadoId del Body y pasarlo al service', async () => {
      await controller.reasignacionReclamoAEmpleado(
        MOCK_RECLAMO_ID_MONGO,
        mockRequest,
        mockEmpleadoAAsignarDto,
      );

      // Verificamos que se llama con los 3 argumentos (ID, Usuario, Empleado ID)
      expect(service.reasignarReclamoAEmpleado).toHaveBeenCalledWith(
        MOCK_RECLAMO_ID_MONGO,
        mockUsuario,
        mockEmpleadoAAsignarDto.empleadoId,
      );
    });
  });

  describe('reasignacionReclamoASubarea', () => {
    it('debe extraer el subareaId del Body y pasarlo al service', async () => {
      await controller.reasignacionReclamoASubarea(
        MOCK_RECLAMO_ID_MONGO,
        mockRequest,
        mockSubareaAAsignarDto,
      );

      expect(service.reasignarReclamoASubarea).toHaveBeenCalledWith(
        MOCK_RECLAMO_ID_MONGO,
        mockUsuario,
        mockSubareaAAsignarDto.subareaId,
      );
    });
  });

  describe('reasignacionReclamoAArea', () => {
    it('debe extraer el areaId del Body y pasarlo al service', async () => {
      await controller.reasignacionReclamoAArea(
        MOCK_RECLAMO_ID_MONGO,
        mockRequest,
        mockAreaAAsignarDto,
      );

      expect(service.reasignarReclamoAArea).toHaveBeenCalledWith(
        MOCK_RECLAMO_ID_MONGO,
        mockUsuario,
        mockAreaAAsignarDto.areaId,
      );
    });
  });
});
