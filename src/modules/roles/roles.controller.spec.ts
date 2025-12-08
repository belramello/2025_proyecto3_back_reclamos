import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RespuestaFindOneRolesDto } from './dto/respuesta-find-one-roles.dto';
import { Rol } from './schema/rol.schema';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';

// --- MOCKS DE DATOS ---

const MOCK_ROL_ID = '60c84c47f897f212d4a1b0c0'; // ID válido de Mongo

// 1. Mock del DTO de respuesta para findAll (salida del servicio)
const mockRespuestaDto: RespuestaFindOneRolesDto = {
  id: MOCK_ROL_ID,
  nombre: 'Admin',
  permisos: [],
};

const mockRespuestaDtoList: RespuestaFindOneRolesDto[] = [
  mockRespuestaDto,
  { ...mockRespuestaDto, id: 'rol-id-2', nombre: 'Empleado' },
];

// 2. Mock de la entidad Rol (respuesta del servicio para findOne)
const mockRolDocument: Rol = {
  _id: MOCK_ROL_ID as any,
  nombre: 'Admin',
  permisos: [],
} as Rol;

// --- MOCKS DE DEPENDENCIAS ---

// Mock del RolesService para aislar el controlador
const mockRolesService = {
  findAll: jest.fn().mockResolvedValue(mockRespuestaDtoList),
  findOne: jest.fn().mockResolvedValue(mockRolDocument),
};

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
        // Mocks para Pipes (aunque se asume que funcionan, se listan por claridad)
        ParseMongoIdPipe,
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  // ----------------------------------------------------------------
  // 1. GET /roles (findAll)
  // ----------------------------------------------------------------
  describe('findAll', () => {
    it('debe llamar a rolesService.findAll y retornar la lista de DTOs', async () => {
      const result = await controller.findAll();

      // Verifica que el método del servicio fue llamado
      expect(service.findAll).toHaveBeenCalledTimes(1);

      // Verifica que el controlador retorna la respuesta del servicio
      expect(result).toEqual(mockRespuestaDtoList);
    });
  });

  // ----------------------------------------------------------------
  // 2. GET /roles/:id (findOne)
  // ----------------------------------------------------------------
  describe('findOne', () => {
    it('debe llamar a rolesService.findOne con el ID válido del parámetro', async () => {
      // Nota: El ParseMongoIdPipe se aplica automáticamente aquí, asegurando que el ID es válido
      const result = await controller.findOne(MOCK_ROL_ID);

      // Verifica que el servicio fue llamado con el ID
      expect(service.findOne).toHaveBeenCalledWith(MOCK_ROL_ID);

      // Verifica que el controlador retorna la respuesta del servicio (la entidad Rol)
      expect(result).toEqual(mockRolDocument);
    });

    it('debe retornar null/undefined si el servicio no encuentra el rol', async () => {
      mockRolesService.findOne.mockResolvedValue(null);
      const result = await controller.findOne(MOCK_ROL_ID);
      expect(result).toBeNull();
    });
  });
});
