import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioSchema } from './schema/usuario.schema';
import { UsuarioMongoRepository } from './repository/usuario-repository';
import { UsersMapper } from './mappers/usuario.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Usuario', schema: UsuarioSchema }]),
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
