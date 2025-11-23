import { Module } from '@nestjs/common';
import { SubareasService } from './subareas.service';
import { SubareasController } from './subareas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subarea, SubareaSchema } from './schemas/subarea.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subarea.name, schema: SubareaSchema }]),
  ],
  controllers: [SubareasController],
  providers: [SubareasService],
})
export class SubareasModule {}
