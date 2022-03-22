import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AllowUserDto } from './dto/allow-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserSignin } from './interface/allow-user.interface';
import { UserSignup } from './interface/create-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto): UserSignup {
    return this.authservice.signup(createUserDto);
  }
  @Post('signin')
  signin(@Body() allowUserDto: AllowUserDto): UserSignin {
    return this.authservice.signin(allowUserDto);
  }
}
