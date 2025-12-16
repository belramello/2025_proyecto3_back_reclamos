import { forwardRef, Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { FeedbackRepository } from './repository/feedback-repository';
import { FeedbackValidator } from './helpers/feedback-validator';
import { MongooseModule } from '@nestjs/mongoose';
import { Feedback, FeedbackSchema } from './schemas/feedback.schema';
import { FeedbackMapper } from './mappers/feedback-mapper';
import { UsuarioModule } from '../usuario/usuario.module';
import { ReclamosModule } from '../reclamos/reclamos.module';
import { JwtModule } from '../jwt/jwt.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
    ]),
    UsuarioModule,
    forwardRef(() => ReclamosModule),
    JwtModule
  ],
  controllers: [FeedbackController],
  providers: [
    FeedbackService,
    {
      provide: 'IFeedbackRepository',
      useClass: FeedbackRepository,
    },
    FeedbackValidator,
    FeedbackMapper
  ],
})
export class FeedbackModule {}
