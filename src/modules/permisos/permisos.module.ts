import { forwardRef, Module } from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { PermisosController } from './permisos.controller';
import { PermisosRepository } from './repositories/permisos-repository';
import { RolesModule } from '../roles/roles.module';
import { PermisosValidator } from './helpers/permisos-validator';
import { MongooseModule } from '@nestjs/mongoose';
import { PermisoSchema } from './schemas/permiso.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Permiso', schema: PermisoSchema }]),
    forwardRef(() => RolesModule),
  ],
  controllers: [PermisosController],
  providers: [
    PermisosService,
    {
      provide: 'IPermisosRepository',
      useClass: PermisosRepository,
    },
    PermisosValidator,
  ],
  exports: [PermisosService],
})
export class PermisosModule {}
