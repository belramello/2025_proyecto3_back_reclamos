import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioMongoRepository } from './repository/usuario-repository';
import { UsersMapper } from './mappers/usuario.mapper';
import { Rol, RolSchema } from '../roles/schema/rol.schema';
import { Usuario, UsuarioSchema } from './schema/usuario.schema';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Rol.name, schema: RolSchema },
    ]),
    RolesModule,
  ],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    {
      provide: 'IUsuarioRepository',
      useClass: UsuarioMongoRepository,
    },
    UsersMapper,
  ],
  exports: [UsuarioService],
})
export class UsuarioModule {}
