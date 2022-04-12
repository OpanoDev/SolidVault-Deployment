// TypeScript interfaces are removed during the transpilation, Nest can't refer to them at runtime

import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

import { MESSAGES, REGEX } from '../../../utils/app.utils';

export class Address {
  readonly address_line: string;

  readonly city: string;

  readonly country: string;
}

export class UserPlan {
  plan: string;

  group?: string;
}

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

  @IsNotEmpty()
  readonly address: Address;

  readonly current_plan: UserPlan;
}
