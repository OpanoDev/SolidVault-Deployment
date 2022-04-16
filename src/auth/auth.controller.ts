import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { CreateUserDto, AllowUserDto, CodeDto } from './dto';
import { MongoExceptionFilter } from './filters/MongoFilter.exception';
import { GetCurrentUserById } from './decorators/getuserid.decorator';
import { GeneralResponse } from './interface';
import { JwtAuthenticationGuard, JwtTwoFactorGuard } from './guards';
import { CookieSettings } from './cookie.services';
import JwtRefreshGuard from './guards/jwt-refresh.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authservice: AuthService,
    private readonly cookieSettings: CookieSettings,
  ) {}

  @UseFilters(MongoExceptionFilter)
  @HttpCode(200)
  @Post('signup')
  signup(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<GeneralResponse> {
    return this.authservice.signup(createUserDto);
  }

  @Post('signin')
  @HttpCode(200)
  signIn(
    @Body() allowUserDto: AllowUserDto,
    @Res() res: Response,
  ): Promise<GeneralResponse> {
    return this.authservice.signin(allowUserDto, res);
  }

  @Get('/refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Res() response: Response, @GetCurrentUserById() id: string) {
    const refreshCookie: string = await this.authservice.refresh(id);
    response.setHeader('Set-Cookie', refreshCookie);
    response.send('done');
  }

  @Post('signout')
  @HttpCode(200)
  @UseGuards(JwtTwoFactorGuard)
  async signOut(
    @Res() response: Response,
    @GetCurrentUserById() id: string,
  ): Promise<GeneralResponse> {
    response.setHeader('Set-Cookie', this.authservice.getCookieForLogOut());
    await this.cookieSettings.removeRefreshToken(id);
    return response.send({
      statusCode: HttpStatus.OK,
      message: 'Successfully logged Out',
    });
  }

  @Post('mfa-signin-totp')
  @UseGuards(JwtAuthenticationGuard)
  @HttpCode(200)
  async mfaSignin(
    @Body() codeDto: CodeDto,
    @GetCurrentUserById() id: string,
    @Res() res: Response,
  ): Promise<GeneralResponse> {
    const resp = await this.authservice.mfaSignin_totp(codeDto.code, id, res);
    return res.send(resp);
  }
}
