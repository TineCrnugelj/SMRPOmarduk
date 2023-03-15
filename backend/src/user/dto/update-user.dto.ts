import { ApiProperty} from '@nestjs/swagger';
import * as Joi from 'joi';

export class UpdateUserDto {

  @ApiProperty({
    example: 'John',
    minLength: 1,
    maxLength: 128,
    nullable: false,
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    minLength: 1,
    maxLength: 128,
    nullable: false,
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    example: 'jdoe',
    minLength: 0,
    maxLength: 128,
    nullable: false,
    required: false,
  })
  username?: string;

  @ApiProperty({
    example: 'jdoe',
    minLength: 1,
    maxLength: 60,
    nullable: false,
    required: false,
  })
  password?: string;

  @ApiProperty({
    example: 'jdoe@example.com',
    minLength: 1,
    maxLength: 255,
    nullable: true,
    required: false,
  })
  email?: string | null;

  @ApiProperty({
    example: 'Sample description',
    minLength: 1,
    maxLength: 65535,
    nullable: true,
    required: false,
  })
  description?: string | null;
}

export const UpdateUserSchema = Joi.object().keys({
  id: Joi.any().strip(),
  firstName: Joi.string().trim().min(1).max(128),
  lastName: Joi.string().trim().min(1).max(128),
  username: Joi.string().trim().min(1).max(128),
  password: Joi.string().trim().min(1).max(60),
  email: Joi.string().trim().min(1).max(255).allow(null),
  description: Joi.string().trim().min(1).max(65535).allow(null),
  dateCreated: Joi.any().strip(),
  dateUpdated: Joi.any().strip(),
});
