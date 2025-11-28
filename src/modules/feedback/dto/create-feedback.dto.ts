import {
  IsNumber,
  IsOptional,
  IsString,
  IsMongoId,
  Min,
  Max,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  valoracion: number;

  @IsOptional()
  @IsString()
  comentario?: string;

  @IsMongoId()
  reclamo: string;

  @IsMongoId()
  cliente: string;
}
