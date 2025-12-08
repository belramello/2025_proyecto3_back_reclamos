import { Test, TestingModule } from '@nestjs/testing';
import { PermisosService } from './permisos.service';
import { IPermisosRepository } from './repositories/permisos-repository.interface';
import { PermisosValidator } from './helpers/permisos-validator';
import { Permiso } from './schemas/permiso.schema';
import { NotFoundException } from '@nestjs/common';

// --- MOCKS DE DATOS ---

const MOCK_ROL_ID = 'rol-id-123';
const MOCK_PERMISO_ID = 'permiso-id-456';

const mockPermiso: Permiso = {
  nombre: 'Crear Usuario',
  roles: [MOCK_ROL_ID],
};

const mockPermisosList: Permiso[] = [
  mockPermiso,
  { nombre: 'Leer Reporte', roles: [MOCK_ROL_ID] },
];

// --- MOCKS DE DEPENDENCIAS ---

// 1. Mock para IPermisosRepository
const mockPermisosRepository = {
  findAll: jest.fn().mockResolvedValue(mockPermisosList),
  findOne: jest.fn().mockResolvedValue(mockPermiso),
  findAllByRol: jest.fn().mockResolvedValue(mockPermisosList),
};

// 2. Mock para PermisosValidator
const mockPermisosValidator = {
  validateRolExistente: jest
    .fn()
    .mockResolvedValue({ _id: MOCK_ROL_ID, nombre: 'Admin' }), // Simula un rol existente
};

describe('PermisosService', () => {
  let service: PermisosService;
  let repository: IPermisosRepository;
  let validator: PermisosValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermisosService,
        {
          provide: 'IPermisosRepository', // Token de inyección
          useValue: mockPermisosRepository,
        },
        {
          provide: PermisosValidator,
          useValue: mockPermisosValidator,
        },
      ],
    }).compile();

    service = module.get<PermisosService>(PermisosService);
    repository = module.get<IPermisosRepository>('IPermisosRepository');
    validator = module.get<PermisosValidator>(PermisosValidator);

    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  // ----------------------------------------------------------------
  // 1. Método findAll()
  // ----------------------------------------------------------------
  describe('findAll', () => {
    it('debe llamar al repository.findAll y retornar la lista de permisos', async () => {
      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPermisosList);
    });
  });

  // ----------------------------------------------------------------
  // 2. Método findOne()
  // ----------------------------------------------------------------
  describe('findOne', () => {
    it('debe llamar al repository.findOne con el ID y retornar el permiso', async () => {
      const result = await service.findOne(MOCK_PERMISO_ID);

      expect(repository.findOne).toHaveBeenCalledWith(MOCK_PERMISO_ID);
      expect(result).toEqual(mockPermiso);
    });

    it('debe retornar null si el permiso no existe', async () => {
      mockPermisosRepository.findOne.mockResolvedValue(null);
      const result = await service.findOne('non-existent-id');
      expect(result).toBeNull();
    });
  });

  // ----------------------------------------------------------------
  // 3. Método findAllByRol()
  // ----------------------------------------------------------------
  describe('findAllByRol', () => {
    it('debe validar la existencia del rol y luego llamar a repository.findAllByRol', async () => {
      const result = await service.findAllByRol(MOCK_ROL_ID);

      // 1. Verificar que se llamó al validator primero
      expect(validator.validateRolExistente).toHaveBeenCalledWith(MOCK_ROL_ID);

      // 2. Verificar que se llamó al repository
      expect(repository.findAllByRol).toHaveBeenCalledWith(MOCK_ROL_ID);
      expect(result).toEqual(mockPermisosList);
    });

    it('debe propagar NotFoundException si el validator falla', async () => {
      // Mockeamos el validator para que lance una excepción
      const notFoundError = new NotFoundException('Rol no encontrado');
      mockPermisosValidator.validateRolExistente.mockRejectedValue(
        notFoundError,
      );

      await expect(service.findAllByRol('invalid-rol')).rejects.toThrow(
        NotFoundException,
      );

      // El repository NO debe ser llamado si la validación falla
      expect(repository.findAllByRol).not.toHaveBeenCalled();
    });
  });
});
