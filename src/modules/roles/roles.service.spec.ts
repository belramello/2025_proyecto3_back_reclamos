import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { IRolesRepository } from './repositories/roles-repository.interface';
import { RolesMapper } from './mappers/roles-mapper';
import { Rol } from './schema/rol.schema';
import { RespuestaFindOneRolesDto } from './dto/respuesta-find-one-roles.dto';

// --- MOCKS DE DATOS ---

const MOCK_ROL_ID = '60c84c47f897f212d4a1b0c0';
const MOCK_PERMISO_ID = 'permiso-id-1';

// 1. Mock de la entidad Rol (respuesta del Repository)
const mockRolDocument: Rol = {
  _id: MOCK_ROL_ID as any, // ID necesario para el mapper
  nombre: 'Admin',
  permisos: [{ _id: MOCK_PERMISO_ID, nombre: 'crear_todo' }] as any,
} as Rol;

const mockRolesList: Rol[] = [
  mockRolDocument,
  { ...mockRolDocument, _id: 'rol-id-2', nombre: 'Empleado' } as Rol,
];

// 2. Mock del DTO de respuesta (salida del Mapper)
const mockRespuestaDto: RespuestaFindOneRolesDto = {
  id: MOCK_ROL_ID,
  nombre: 'Admin',
  permisos: [{ _id: MOCK_PERMISO_ID, nombre: 'crear_todo' }] as any,
};

const mockRespuestaDtoList: RespuestaFindOneRolesDto[] = [
  mockRespuestaDto,
  { ...mockRespuestaDto, id: 'rol-id-2', nombre: 'Empleado' },
];

// --- MOCKS DE DEPENDENCIAS ---

// 1. Mock para IRolesRepository
const mockRolesRepository = {
  findAll: jest.fn().mockResolvedValue(mockRolesList),
  findOne: jest.fn().mockResolvedValue(mockRolDocument),
};

// 2. Mock para RolesMapper
const mockRolesMapper = {
  // Simula el mapeo de la lista completa (usaremos el resultado final)
  toRespuestaFindOneRoles: jest.fn().mockReturnValue(mockRespuestaDtoList),
  toRespuestaFindOne: jest.fn(), // No se usa directamente en el servicio, pero se define
};

describe('RolesService', () => {
  let service: RolesService;
  let repository: IRolesRepository;
  let mapper: RolesMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: 'IRolesRepository', // Token de inyección
          useValue: mockRolesRepository,
        },
        {
          provide: RolesMapper,
          useValue: mockRolesMapper,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get<IRolesRepository>('IRolesRepository');
    mapper = module.get<RolesMapper>(RolesMapper);

    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  // ----------------------------------------------------------------
  // 1. Método findAll()
  // ----------------------------------------------------------------
  describe('findAll', () => {
    it('debe llamar a repository.findAll y mapear la lista a DTOs de respuesta', async () => {
      const result = await service.findAll();

      // 1. Verificar llamada al repositorio
      expect(repository.findAll).toHaveBeenCalledTimes(1);

      // 2. Verificar llamada al mapper con la lista devuelta por el repo
      expect(mapper.toRespuestaFindOneRoles).toHaveBeenCalledWith(
        mockRolesList,
      );

      // 3. Verificar el resultado final (DTOs)
      expect(result).toEqual(mockRespuestaDtoList);
    });

    it('debe retornar un array vacío si el repository no encuentra roles', async () => {
      mockRolesRepository.findAll.mockResolvedValue([]);
      mockRolesMapper.toRespuestaFindOneRoles.mockReturnValue([]);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  // ----------------------------------------------------------------
  // 2. Método findOne()
  // ----------------------------------------------------------------
  describe('findOne', () => {
    it('debe llamar a repository.findOne con el ID y retornar la entidad Rol (sin mapear)', async () => {
      const result = await service.findOne(MOCK_ROL_ID);

      // 1. Verificar llamada al repositorio
      expect(repository.findOne).toHaveBeenCalledWith(MOCK_ROL_ID);

      // 2. Verificar que el mapper NO fue llamado (según la lógica actual del servicio)
      expect(mapper.toRespuestaFindOne).not.toHaveBeenCalled();

      // 3. Verificar la respuesta (entidad de la BD)
      expect(result).toEqual(mockRolDocument);
    });

    it('debe retornar null si el rol no existe', async () => {
      mockRolesRepository.findOne.mockResolvedValue(null);
      const result = await service.findOne('non-existent-id');
      expect(result).toBeNull();
    });
  });
});
