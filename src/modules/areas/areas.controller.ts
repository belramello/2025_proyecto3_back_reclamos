import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreaDto } from './dto/area-dto';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import type { RequestWithUsuario } from 'src/middlewares/auth.middleware';

@UseGuards(AuthGuard)
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  async findAll(): Promise<AreaDto[]> {
    return await this.areasService.findAll();
  }

  @Get('/usuario')
  async findAllByUsuario(@Req() req: RequestWithUsuario): Promise<AreaDto[]> {
    return await this.areasService.findAllByUsuario(String(req.usuario._id));
  }
}
