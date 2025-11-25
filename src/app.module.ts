import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { EstadosModule } from './modules/estados/estados.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermisosModule } from './modules/permisos/permisos.module';
import { HistorialAsignacionModule } from './modules/historial-asignacion/historial-asignacion.module';
import { AreasModule } from './modules/areas/areas.module';
import { SubareasModule } from './modules/subareas/subareas.module';
import { HistorialEstadoModule } from './modules/historial-estado/historial-estado.module';
import { ReclamosModule } from './modules/reclamos/reclamos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017',
      {
        dbName: 'R3cl4mos',
      },
    ),
    AuthModule,
    UsuarioModule,
    EstadosModule,
    RolesModule,
    PermisosModule,
    HistorialAsignacionModule,
    AreasModule,
    SubareasModule,
    HistorialEstadoModule,
    ReclamosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
