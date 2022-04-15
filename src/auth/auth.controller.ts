import {
  Body,
  Controller,
  Post,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, AllowUserDto, CodeDto } from './dto';
import { MongoExceptionFilter } from './filters/MongoFilter.exception';
import { User } from './models/user.schema';
import { MFASignin } from './interface/mfasignin.interface';

@Controller('api/auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @UseFilters(MongoExceptionFilter)
  @Post('signup')
  signup(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.authservice.signup(createUserDto);
  }

  @Post('signin')
  signin(@Body() allowUserDto: AllowUserDto): Promise<string> {
    return this.authservice.signin(allowUserDto);
  }

  // @Post('mfa-signin')
  // mfaSignin(@Body() codeDto: CodeDto): Promise<MFASignin> {
  //   return this.authservice.mfaSignin(codeDto.code, codeDto.username);
  // }
}
