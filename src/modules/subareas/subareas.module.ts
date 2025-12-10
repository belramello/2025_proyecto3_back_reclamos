import { forwardRef, Module } from '@nestjs/common';
import { SubareasService } from './subareas.service';
import { SubareasController } from './subareas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subarea, SubareaSchema } from './schemas/subarea.schema';
import { SubareasRepository } from './repositories/subareas-repository';
import { SubareasValidator } from './helpers/subareas-validator';
import { UsuarioModule } from '../usuario/usuario.module';
import { JwtModule } from '../jwt/jwt.module';
import { SubareasMapper } from './helpers/subareas-mapper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subarea.name, schema: SubareaSchema }]),
    forwardRef(() => UsuarioModule),
    JwtModule,
  ],
  controllers: [SubareasController],
  providers: [
    SubareasService,
    SubareasValidator,
    {
      provide: 'ISubareasRepository',
      useClass: SubareasRepository,
    },
    SubareasMapper,
  ],
  exports: [SubareasValidator, SubareasService, SubareasMapper],
})
export class SubareasModule {}
