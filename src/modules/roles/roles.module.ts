import { forwardRef, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RolSchema } from './schema/rol.schema';
import { RolesController } from './roles.controller';
import { PermisosModule } from '../permisos/permisos.module';
import { RolesRepository } from './repositories/roles-repository';
import { RolesValidator } from './helpers/roles-validator';
import { RolesMapper } from './mappers/roles-mapper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Rol', schema: RolSchema }]),
    forwardRef(() => PermisosModule),
  ],
  providers: [
    RolesService,
    {
      provide: 'IRolesRepository',
      useClass: RolesRepository,
    },
    RolesValidator,
    RolesMapper,
  ],
  controllers: [RolesController],
  exports: [RolesService, RolesMapper, RolesValidator],
})
export class RolesModule {}
