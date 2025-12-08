import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { IUsuarioRepository } from './repository/usuario-repository.interface';
import { UsersMapper } from './mappers/usuario.mapper';
import { RolesValidator } from '../roles/helpers/roles-validator';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioDocumentType } from './schema/usuario.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// --- MOCKS DE DEPENDENCIAS Y DATOS ---

const MOCK_USER_ID = 'user-id-123';
const MOCK_ROL_ID = 'rol-id-123';
const MOCK_EMAIL = 'generic@test.com';

const mockRolDB = { _id: MOCK_ROL_ID, nombre: 'Cliente' } as any;

const mockInputCreate: CreateUsuarioDto = {
  nombreUsuario: 'generic_user',
  email: MOCK_EMAIL,
  contraseña: 'password123',
  rol: MOCK_ROL_ID,
  nombre: 'Generic Name',
  // Los campos opcionales aquí no se usan en el input para simplificar
};

const mockInputUpdate: UpdateUsuarioDto = {
  nombre: 'Updated Name',
  direccion: 'Updated Address',
};

// Objeto que simula la respuesta de la BD (sin campos opcionales poblados)
const mockUsuarioDB: UsuarioDocumentType = {
  _id: MOCK_USER_ID,
  nombreUsuario: mockInputCreate.nombreUsuario,
  email: MOCK_EMAIL,
  contraseña: 'hashed-password',
  rol: mockRolDB,
  nombre: mockInputCreate.nombre,
  direccion: undefined, // Simula que estos campos no vienen de la DB
  telefono: undefined,  // Simula que estos campos no vienen de la DB
  area: undefined,      // Simula que estos campos no vienen de la DB
  subarea: undefined,   // Simula que estos campos no vienen de la DB
  createdAt: new Date(),
} as any;

// ESTRUCTURA MÍNIMA FLEXIBLE PARA CREATE/FINDONE
// Debe incluir los campos opcionales del DTO con el valor 'undefined' que produce el mapper,
// porque el objeto de Jest debe COINCIDIR con la INSTANCIA de RespuestaUsuarioDto.
const EXPECTED_MINIMUM_DTO_STRUCTURE = {
    id: MOCK_USER_ID, 
    nombreUsuario: mockInputCreate.nombreUsuario, 
    email: MOCK_EMAIL,
    rol: mockRolDB, 
    nombre: mockInputCreate.nombre,
    // Campos opcionales que el mapper devuelve como undefined
    direccion: undefined,
    telefono: undefined,
    area: undefined,
    subarea: undefined,
};


// Mocks para las dependencias
const mockUsuarioRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  remove: jest.fn().mockResolvedValue(undefined),
};

const mockRolesValidator = {
  validateRolExistente: jest.fn().mockResolvedValue(mockRolDB),
};

const mockUsersMapper = new UsersMapper(); // Usamos la instancia real del Mapper

// Mock para bcrypt (para createCliente)
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('mocked-salt'),
  hash: jest.fn().mockResolvedValue('mocked-hashed-password'),
}));

describe('UsuarioService', () => {
  let service: UsuarioService;
  let usuariosRepository: IUsuarioRepository;
  let rolesValidator: RolesValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: 'IUsuarioRepository',
          useValue: mockUsuarioRepository,
        },
        UsersMapper, // Usamos la implementación real
        {
          provide: RolesValidator,
          useValue: mockRolesValidator,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    usuariosRepository = module.get<IUsuarioRepository>('IUsuarioRepository');
    rolesValidator = module.get<RolesValidator>(RolesValidator);

    jest.clearAllMocks();
    jest.spyOn(service as any, 'enviarEmailBienvenida').mockImplementation(() => {}); 
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  // ----------------------------------------------------------------
  // 1. Método create()
  // ----------------------------------------------------------------
  describe('create', () => {
    it('debe crear un usuario y retornar el DTO con la estructura mínima flexible', async () => {
      jest.spyOn(usuariosRepository, 'create').mockResolvedValue(mockUsuarioDB);

      const result = await service.create(mockInputCreate);

      expect(rolesValidator.validateRolExistente).toHaveBeenCalledWith(MOCK_ROL_ID);
      expect(usuariosRepository.create).toHaveBeenCalled();
      
      // La verificación debe ser contra el objeto plano que COINCIDE exactamente con la instancia DTO
      expect(result).toEqual(
        expect.objectContaining(EXPECTED_MINIMUM_DTO_STRUCTURE)
      );
    });
  });

  // ----------------------------------------------------------------
  // 2. Método findAll()
  // ----------------------------------------------------------------
  describe('findAll', () => {
    it('debe retornar un array de RespuestaUsuarioDto con la estructura correcta', async () => {
      // Mock para el segundo usuario, debe tener los mismos campos opcionales como undefined
      const mockUsuarioDB2 = { 
          ...mockUsuarioDB, 
          _id: 'id-2', 
          email: 'another@test.com',
          direccion: undefined,
          telefono: undefined,
          area: undefined,
          subarea: undefined,
      } as any;
      const mockUsuariosDBList = [mockUsuarioDB, mockUsuarioDB2];
      jest.spyOn(usuariosRepository, 'findAll').mockResolvedValue(mockUsuariosDBList);
      
      const result = await service.findAll();
      
      expect(usuariosRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      
      // Verificamos que AMBOS elementos contengan la estructura mínima
      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining(EXPECTED_MINIMUM_DTO_STRUCTURE),
        expect.objectContaining({ 
            ...EXPECTED_MINIMUM_DTO_STRUCTURE, 
            id: 'id-2', 
            email: 'another@test.com' 
        }),
      ]));
    });
    
    it('debe retornar un array vacío si no hay usuarios', async () => {
        jest.spyOn(usuariosRepository, 'findAll').mockResolvedValue([]);
        const result = await service.findAll();
        expect(result).toEqual([]);
    });
  });

  // ----------------------------------------------------------------
  // 3. Método findOne()
  // ----------------------------------------------------------------
  describe('findOne', () => {
    it('debe retornar el RespuestaUsuarioDto si el usuario existe', async () => {
      jest.spyOn(usuariosRepository, 'findOne').mockResolvedValue(mockUsuarioDB);
      const result = await service.findOne(MOCK_USER_ID);
      
      expect(usuariosRepository.findOne).toHaveBeenCalledWith(MOCK_USER_ID);
      // Validación flexible
      expect(result).toEqual(expect.objectContaining(EXPECTED_MINIMUM_DTO_STRUCTURE));
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      jest.spyOn(usuariosRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  
  // ----------------------------------------------------------------
  // 4. Método findOneForAuth()
  // ----------------------------------------------------------------
  describe('findOneForAuth', () => {
    it('debe retornar el UsuarioDocumentType si el usuario existe', async () => {
        jest.spyOn(usuariosRepository, 'findOne').mockResolvedValue(mockUsuarioDB);
        const result = await service.findOneForAuth(MOCK_USER_ID);
        
        expect(result).toBe(mockUsuarioDB);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
        jest.spyOn(usuariosRepository, 'findOne').mockResolvedValue(null);
        await expect(service.findOneForAuth('non-existent-id')).rejects.toThrow(
            NotFoundException,
        );
    });
  });

  // ----------------------------------------------------------------
  // 5. Método update()
  // ----------------------------------------------------------------
  describe('update', () => {
    it('debe actualizar el usuario y retornar el DTO actualizado', async () => {
      // 1. Objeto de BD mockeado DESPUÉS de la actualización (reflejando los cambios)
      const mockUpdatedDB = { 
        ...mockUsuarioDB, 
        nombre: mockInputUpdate.nombre, 
        direccion: mockInputUpdate.direccion,
        // Y los otros campos opcionales siguen siendo undefined
        telefono: undefined,
        area: undefined,
        subarea: undefined,
      } as any;
      
      jest.spyOn(usuariosRepository, 'update').mockResolvedValue(mockUpdatedDB);
      
      const result = await service.update(MOCK_USER_ID, mockInputUpdate);

      expect(usuariosRepository.update).toHaveBeenCalled();
      
      // 2. Patrón de comparación ESPECÍFICO para el update (con los nuevos valores)
      const EXPECTED_UPDATED_DTO = {
          ...EXPECTED_MINIMUM_DTO_STRUCTURE,
          nombre: mockInputUpdate.nombre, // ¡Este valor cambió!
          direccion: mockInputUpdate.direccion, // ¡Este valor cambió!
          id: MOCK_USER_ID,
      };

      // Usamos el patrón específico para esta prueba
      expect(result).toEqual(expect.objectContaining(EXPECTED_UPDATED_DTO));
    });

    it('debe lanzar NotFoundException si el usuario no se encuentra para actualizar', async () => {
      jest.spyOn(usuariosRepository, 'update').mockResolvedValue(null);
      
      await expect(service.update(MOCK_USER_ID, mockInputUpdate)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ----------------------------------------------------------------
  // 6. Método remove()
  // ----------------------------------------------------------------
  describe('remove', () => {
    it('debe llamar al repositorio para eliminar el usuario', async () => {
      await service.remove(MOCK_USER_ID);
      expect(usuariosRepository.remove).toHaveBeenCalledWith(MOCK_USER_ID);
    });
  });

  // ----------------------------------------------------------------
  // 7. Método findByEmail()
  // ----------------------------------------------------------------
  describe('findByEmail', () => {
    it('debe retornar el UsuarioDocumentType si existe', async () => {
        jest.spyOn(usuariosRepository, 'findByEmail').mockResolvedValue(mockUsuarioDB);
        const result = await service.findByEmail(MOCK_EMAIL);
        expect(result).toBe(mockUsuarioDB);
    });
    
    it('debe retornar null si no existe', async () => {
        jest.spyOn(usuariosRepository, 'findByEmail').mockResolvedValue(null);
        const result = await service.findByEmail('non-existent@test.com');
        expect(result).toBeNull();
    });
  });

  // ----------------------------------------------------------------
  // 8. Método createCliente()
  // ----------------------------------------------------------------
  describe('createCliente', () => {
    // Caso de error 1: Email ya registrado
    it('debe lanzar ConflictException si el email ya existe', async () => {
      jest.spyOn(usuariosRepository, 'findByEmail').mockResolvedValue(mockUsuarioDB);
      await expect(service.createCliente(mockInputCreate)).rejects.toThrow(
        ConflictException,
      );
    });
    
    // Caso de éxito
    it('debe crear un cliente, hashear la contraseña y retornar el DTO con la estructura flexible', async () => {
      jest.spyOn(usuariosRepository, 'findByEmail').mockResolvedValue(null); 
      jest.spyOn(usuariosRepository, 'create').mockResolvedValue(mockUsuarioDB);
      
      const emailSpy = jest.spyOn(service as any, 'enviarEmailBienvenida');

      const result = await service.createCliente(mockInputCreate);

      // Verificamos que la función de creación fue llamada con la contraseña hasheada
      expect(usuariosRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
            ...mockInputCreate,
            contraseña: 'mocked-hashed-password',
        }),
        mockRolDB, // Objeto Rol validado
      );
      
      // Verificación flexible del DTO de salida
      expect(result).toEqual(
        expect.objectContaining(EXPECTED_MINIMUM_DTO_STRUCTURE)
      );
    });
  });
});
