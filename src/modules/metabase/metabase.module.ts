import { Module } from '@nestjs/common';
import { MetabaseService } from './metabase.service';
import { MetabaseController } from './metabase.controller';
import { JwtModule } from '../jwt/jwt.module';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [UsuarioModule, JwtModule],
  controllers: [MetabaseController],
  providers: [MetabaseService],
})
export class MetabaseModule {}
