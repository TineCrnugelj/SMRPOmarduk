import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Prepare UI',
    minLength: 1,
    maxLength: 255,
    nullable: false,
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 1,
    minimum: 0,
    nullable: false,
    required: true,
  })
  remaining: number;

  @ApiProperty({
    minimum: 1,
    nullable: true,
    required: false,
  })
  assignedUserId?: number | null;
}

export const CreateTaskSchema = Joi.object().keys({
  id: Joi.any().strip(),
  name: Joi.string().max(255).required(),
  category: Joi.any().strip(),
  remaining: Joi.number().min(0).required(),
  dateAssigned: Joi.any().strip(),
  dateAccepted: Joi.any().strip(),
  dateActive: Joi.any().strip(),
  dateEnded: Joi.any().strip(),
  dateCreated: Joi.any().strip(),
  dateUpdated: Joi.any().strip(),
  storyId: Joi.any().strip(),
  story: Joi.any().strip(),
  assignedUserId: Joi.number().min(1).allow(null),
  assignedUser: Joi.any().strip(),
  userTime: Joi.any().strip(),
});