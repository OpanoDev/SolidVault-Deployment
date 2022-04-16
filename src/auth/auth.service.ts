import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { User, UserDocument } from './models/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryprt from 'bcrypt';
import { AllowUserDto, CreateUserDto } from './dto';
import { TOTPUserSettingsGeneral } from 'src/mfa-auth/mfa-totp-auth/mfa-totp-general.service';
import { GeneralResponse } from './interface';
import { CookieSettings } from './cookie.services';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly totpUserSettingsGeneral: TOTPUserSettingsGeneral,
    private readonly cookieSettings: CookieSettings,
  ) {}

  async signup(userSignup: CreateUserDto): Promise<GeneralResponse> {
    // main logic
    if (userSignup.password !== userSignup.confirmPassword) {
      throw new ServiceUnavailableException('Passwords Mismatched!');
    } else {
      const createdUser = new this.userModel(userSignup);
      // return createdUser.save();
      const result = await createdUser.save();
      if (!result) throw new HttpException('Unable to create user', 404);
      return {
        statusCode: HttpStatus.OK,
        message: 'User Registered',
      };
    }
  }
  async signin(
    userSignin: AllowUserDto,
    res: Response,
  ): Promise<GeneralResponse> {
    const user = await this.userModel.findOne({
      emailId: userSignin.emailId,
    });
    if (user === null) throw new BadRequestException('User Not Found');
    if (!user) throw new UnauthorizedException('Credentials Incorrect!');
    const valid = await bcryprt.compare(userSignin.password, user.password);
    if (!valid) throw new BadRequestException('Credential Incorrect!');

    if (valid && user) {
      const accessTokenCookie: string =
        await this.cookieSettings.getCookieWithJwtToken(user._id);
      const { refreshToken, refreshCookie }: any =
        await this.cookieSettings.getCookieWithJwtRefreshToken(user._id);

      await this.cookieSettings.setCurrentRefreshToken(refreshToken, user._id);

      res.setHeader('Set-Cookie', [accessTokenCookie, refreshCookie]);
      user.password = undefined;

      if (user.mfa.status === 'enabled') {
        const toBeReturned: GeneralResponse = {
          statusCode: HttpStatus.OK,
          message: 'Success!, verify mfa',
        };
        return res.send(toBeReturned);
      } else {
        const toBeReturned: GeneralResponse = {
          statusCode: HttpStatus.OK,
          message: 'User can Log in',
        };
        return res.send(toBeReturned);
      }
    }
  }

  public getCookieForLogOut(): string[] {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async mfaSignin_totp(
    code: string,
    id: string,
    res: Response,
  ): Promise<GeneralResponse> {
    const user: User = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('User not Found!!');
    if (user.mfa.status === 'disabled')
      throw new BadRequestException('MFA is Disabled');
    const isValid: boolean =
      this.totpUserSettingsGeneral.isTwoFactorAuthenticationCodeValid(
        code,
        user.mfa.secret,
      );

    if (!isValid) throw new UnauthorizedException('Wrong Authentication Code');
    const cookie: string =
      await this.cookieSettings.getCookieWithJwtAccessTokenMFA(id, true);

    res.setHeader('Set-Cookie', cookie);

    return {
      statusCode: HttpStatus.OK,
      message: 'TOTP verified!',
    };
  }
  async refresh(id: string): Promise<string> {
    const user: User = await this.userModel.findById(id);
    if (user.mfa.status === 'disabled') {
      const accessTokenCookie: string =
        await this.cookieSettings.getCookieWithJwtToken(id);
      return accessTokenCookie;
    } else {
      const accessTokenCookie: string =
        await this.cookieSettings.getCookieWithJwtAccessTokenMFA(id, true);
      return accessTokenCookie;
    }
  }
}
