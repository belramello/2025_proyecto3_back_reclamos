import { forwardRef, Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Area, AreaSchema } from './schemas/area.schema';
import { AreaRepository } from './repositories/areas-repository';
import { AreasValidator } from './helpers/areas-validator';
import { AreasMapper } from './helpers/areas-mapper';
import { UsuarioModule } from '../usuario/usuario.module';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }]),
    forwardRef(() => UsuarioModule),
    JwtModule,
  ],
  controllers: [AreasController],
  providers: [
    AreasService,
    {
      provide: 'IAreaRepository',
      useClass: AreaRepository,
    },
    AreasValidator,
    AreasMapper,
  ],
  exports: [AreasValidator, AreasService, AreasMapper],
})
export class AreasModule {}
