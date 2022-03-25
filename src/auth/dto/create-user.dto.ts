// TypeScript interfaces are removed during the transpilation, Nest can't refer to them at runtime

import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

import { MESSAGES, REGEX } from '../../../utils/app.utils';

export class CreateUserDto {
  @IsNotEmpty()
  readonly fullName: string;

  @IsEmail()
  @IsNotEmpty()
  readonly emailId: string;

  @IsNotEmpty()
  readonly phoneNumber: number;

  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  readonly password: string;

  @IsNotEmpty()
  readonly confirmPassword: string;
  // readonly city: string;
  // readonly country: string;
}
