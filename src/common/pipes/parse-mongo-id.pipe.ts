import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const isValid = Types.ObjectId.isValid(value);
    if (!isValid) {
      throw new BadRequestException(
        `El ID proporcionado ("${value}") no es un formato válido de MongoDB ID.`,
      );
    }
    return value;
  }
}
