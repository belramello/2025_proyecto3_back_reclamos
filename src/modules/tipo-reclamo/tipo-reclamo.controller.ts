import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TipoReclamosService } from './tipo-reclamo.service';
import { TipoReclamoDocumentType } from './schemas/tipo-reclamo.schema';

@Controller('tipo-reclamo')
export class TipoReclamoController {
  constructor(private readonly tipoReclamoService: TipoReclamosService) {}

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
  ): Promise<TipoReclamoDocumentType | null> {
    return await this.tipoReclamoService.findOne(id);
  }
  @Get()
  async findAll(): Promise<TipoReclamoDocumentType[]> {
    return this.tipoReclamoService.findAll();
  }
}
