import { Test, TestingModule } from '@nestjs/testing';
import { PermisosController } from './permisos.controller';
import { PermisosService } from './permisos.service';
import { Permiso } from './schemas/permiso.schema';

// --- MOCKS DE DATOS Y SERVICIOS ---

const MOCK_PERMISO_ID = 'permiso-id-456';

// 1. Mock de la estructura de Permiso
const mockPermiso: Permiso = {
  nombre: 'Crear_Usuario',
  roles: ['rol-id-1'],
} as Permiso; // Usamos 'as Permiso' para simplificar la creación del objeto

const mockPermisosList: Permiso[] = [
  mockPermiso,
  { nombre: 'Leer_Reporte', roles: ['rol-id-1'] } as Permiso,
];

// 2. Mock del PermisosService para aislar el controlador
const mockPermisosService = {
  findAll: jest.fn().mockResolvedValue(mockPermisosList),
};

// --- SUITE DE TESTS ---

describe('PermisosController', () => {
  let controller: PermisosController;
  let service: PermisosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermisosController],
      providers: [
        {
          provide: PermisosService,
          useValue: mockPermisosService,
        },
      ],
    }).compile();

    controller = module.get<PermisosController>(PermisosController);
    service = module.get<PermisosService>(PermisosService);
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  // ----------------------------------------------------------------
  // 1. GET /permisos (findAll)
  // ----------------------------------------------------------------
  describe('findAll', () => {
    it('debe llamar a permisosService.findAll y retornar la lista de Permisos', async () => {
      const result = await controller.findAll();

      // Verifica que el método del servicio fue llamado
      expect(service.findAll).toHaveBeenCalledTimes(1);

      // Verifica que el controlador retorna la respuesta del servicio
      expect(result).toEqual(mockPermisosList);
      expect(result.length).toBe(2);
    });
  });
});
