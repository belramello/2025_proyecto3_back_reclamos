import { Module } from '@nestjs/common';
import { SubareasService } from './subareas.service';
import { SubareasController } from './subareas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subarea, SubareaSchema } from './schemas/subarea.schema';
import { SubareasRepository } from './repositories/subareas-repository';
import { SubareasValidator } from './helpers/subareas-validator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subarea.name, schema: SubareaSchema }]),
  ],
  controllers: [SubareasController],
  providers: [
    SubareasService,
    SubareasValidator,
    {
      provide: 'ISubareasRepository',
      useClass: SubareasRepository,
    },
  ],
  exports: [SubareasValidator],
})
export class SubareasModule {}
