// TypeScript interfaces are removed during the transpilation, Nest can't refer to them at runtime

import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { MESSAGES, REGEX } from '../../../utils/app.utils';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly fullName: string;
  @IsEmail()
  @IsNotEmpty()
  readonly emailId: string;
  @IsNumber()
  @IsNotEmpty()
  readonly phoneNumber: number;
  @IsString()
  @IsNotEmpty()
  readonly username: string;
  @IsString()
  @IsNotEmpty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  readonly password: string;
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  readonly confirmPassword: string;
  // readonly city: string;
  // readonly country: string;
}
