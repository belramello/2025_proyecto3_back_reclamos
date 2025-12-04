import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.feedbackService.findAll(paginationDto);
  }
}
