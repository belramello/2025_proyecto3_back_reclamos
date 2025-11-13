import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ReclamosModule } from './modules/reclamos/reclamos.module';
import { TipoReclamoModule } from './modules/tipo-reclamo/tipo-reclamo.module';
import { NivelCriticidadModule } from './modules/nivel-criticidad/nivel-criticidad.module';
import { PrioridadModule } from './modules/prioridad/prioridad.module';

@Module({
  imports: [

    ConfigModule.forRoot({ isGlobal: true }),


    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
        dbName: config.get<string>('MONGO_DB'),
      }),
    }),

    // Tus módulos
    ReclamosModule,
    TipoReclamoModule,
    NivelCriticidadModule,
    PrioridadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
