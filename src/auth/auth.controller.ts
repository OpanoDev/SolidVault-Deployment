import {
  Body,
  Controller,
  Post,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, AllowUserDto } from './dto';
import { MongoExceptionFilter } from './filters/MongoFilter.exception';
import { User } from './models/user.schema';

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
}
