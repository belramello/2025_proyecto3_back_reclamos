import { Module, forwardRef } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioMongoRepository } from './repository/usuario-repository';
import { UsersMapper } from './mappers/usuario.mapper';
import { Rol, RolSchema } from '../roles/schema/rol.schema';
import { Usuario, UsuarioSchema } from './schema/usuario.schema';
import { RolesModule } from '../roles/roles.module';
import { UsuariosValidator } from './helpers/usuarios-validator';
import { ProyectosModule } from '../proyectos/proyectos.module';
import { SubareasModule } from '../subareas/subareas.module';
import { ReclamosModule } from '../reclamos/reclamos.module';
import { JwtModule } from '../jwt/jwt.module';
import { UsuariosHelper } from './helpers/usuarios-helper';
import { UsuarioCreacionStrategy } from './strategies/usuario-creacion.strategy.interface';
import { ClienteStrategy } from './strategies/cliente.strategy';
import { EmpleadoStrategy } from './strategies/empleado.strategy';
import { EncargadoStrategy } from './strategies/encargado.strategy';
import { AreasModule } from '../areas/areas.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Rol.name, schema: RolSchema },
    ]),
    RolesModule,
    JwtModule,
    forwardRef(() => ProyectosModule),
    forwardRef(() => SubareasModule),
    forwardRef(() => ReclamosModule),
    AreasModule,
  ],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    UsuariosValidator,
    EmpleadoStrategy,
    ClienteStrategy,
    EncargadoStrategy,
    {
      provide: 'IUsuarioRepository',
      useClass: UsuarioMongoRepository,
    },
    {
      provide: 'USUARIO_STRATEGIES',
      useFactory: (...strategies: UsuarioCreacionStrategy[]) => strategies,
      inject: [EmpleadoStrategy, ClienteStrategy, EncargadoStrategy],
    },
    UsersMapper,
    UsuariosHelper,
  ],
  exports: [UsuarioService, UsuariosValidator, UsersMapper],
})
export class UsuarioModule {}
