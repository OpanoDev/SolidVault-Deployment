import { IsEmail, IsNotEmpty } from 'class-validator';

export class AllowUserDto {
  @IsEmail()
  readonly emailId: string;
  @IsNotEmpty()
  readonly password: string;
}
