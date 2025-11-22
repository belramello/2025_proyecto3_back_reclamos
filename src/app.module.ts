import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioSchema } from './modules/usuario/schema/usuario.schema';
import { AuthModule } from './modules/auth/auth.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { EstadosModule } from './modules/estados/estados.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermisosModule } from './modules/permisos/permisos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017',
      {
        dbName: 'R3cl4mos',
      },
    ),
    MongooseModule.forFeature([{ name: 'Usuario', schema: UsuarioSchema }]),
    AuthModule,
    UsuarioModule,
    EstadosModule,
    RolesModule,
    PermisosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
