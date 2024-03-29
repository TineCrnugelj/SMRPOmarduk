import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class UpdateStoryTimeComplexityDto {
  @ApiProperty({
    description: 'Time complexity.',
    example: 1,
    minimum: 0,
    maximum: 99,
    default: 1,
    type: Number,
    required: true
  })
  timeComplexity: number;
}

export const UpdateStoryTimeComplexitySchema = Joi.object().keys({
  timeComplexity: Joi.number().min(0).max(99).required().default(1),
});
