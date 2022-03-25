import { IsEmail, IsNotEmpty } from 'class-validator';

export class AllowUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly emailId: string;
  @IsNotEmpty()
  readonly password: string;
}
