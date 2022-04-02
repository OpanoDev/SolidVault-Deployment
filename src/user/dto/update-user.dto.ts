import { IsEmail } from 'class-validator';

export class UpdateUserDto {
  readonly fullName?: string;

  @IsEmail()
  readonly emailId?: string;

  readonly phoneNumber?: string;

  readonly username?: string;
}
