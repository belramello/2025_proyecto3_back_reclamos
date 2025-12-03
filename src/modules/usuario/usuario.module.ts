import { forwardRef, Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioMongoRepository } from './repository/usuario-repository';
import { UsersMapper } from './mappers/usuario.mapper';
import { Rol, RolSchema } from '../roles/schema/rol.schema';
import { Usuario, UsuarioSchema } from './schema/usuario.schema';
import { RolesModule } from '../roles/roles.module';
import { UsuariosValidator } from './helpers/usuarios-validator';
import { SubareasModule } from '../subareas/subareas.module';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Rol.name, schema: RolSchema },
    ]),
    RolesModule,
    JwtModule,
    forwardRef(() => SubareasModule),
  ],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    UsuariosValidator,
    {
      provide: 'IUsuarioRepository',
      useClass: UsuarioMongoRepository,
    },
    UsersMapper,
  ],
  exports: [UsuarioService, UsuariosValidator],
})
export class UsuarioModule {}
