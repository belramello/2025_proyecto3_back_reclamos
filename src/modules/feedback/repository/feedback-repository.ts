/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { InjectModel } from '@nestjs/mongoose';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { Feedback, FeedbackDocument } from '../schemas/feedbak.schema';
import { IFeedbackRepository } from './feedback-repository.interface';
import { Model } from 'mongoose';
import { InternalServerErrorException } from '@nestjs/common';

export class FeedbackRepository implements IFeedbackRepository {
  constructor(
    @InjectModel(Feedback.name)
    private readonly feedbackModel: Model<FeedbackDocument>,
  ) {}
  async createFeedback(feedback: CreateFeedbackDto): Promise<FeedbackDocument> {
    const retro = new this.feedbackModel(feedback);
    return await retro.save();
  }
  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{
    feedback: Feedback[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [feedback, total] = await Promise.all([
        this.feedbackModel
          .find()
          .populate('reclamo')
          .populate('cliente')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: 'desc' })
          .exec(),

        this.feedbackModel.countDocuments().exec(),
      ]);

      return {
        feedback,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener los feedback paginados: ${error.message}`,
      );
    }
  }
}
