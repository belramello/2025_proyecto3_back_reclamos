import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoReclamosService } from './tipo-reclamo.service';
import { TipoReclamoController } from './tipo-reclamo.controller';
import { TipoReclamo, TipoReclamoSchema } from './schemas/tipo-reclamo.schema';
import { Area, AreaSchema } from '../areas/schemas/area.schema';
import { TipoReclamosRepository } from './repositories/tiporeclamo-repository';
import { TipoReclamoValidator } from './helpers/tipo-reclamo-validator';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TipoReclamo.name, schema: TipoReclamoSchema },
      { name: Area.name, schema: AreaSchema },
    ]),
  ],
  controllers: [TipoReclamoController],
  providers: [
    TipoReclamosService,
    {
      provide: 'ITipoReclamosRepository',
      useClass: TipoReclamosRepository,
    },
    TipoReclamoValidator,
  ],
  exports: [TipoReclamosService, TipoReclamoValidator],
})
export class TipoReclamoModule {}
