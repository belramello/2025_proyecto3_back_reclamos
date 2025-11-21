import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioSchema } from './schema/usuario.schema';
import { UsuarioMongoRepository } from './repository/usuario-repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UsuarioSchema }]),
  ],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    {
      provide: 'IUsuarioRepository',
      useClass: UsuarioMongoRepository,
    },
  ],
})
export class UsuarioModule {}
