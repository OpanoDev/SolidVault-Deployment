import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { User, UserDocument } from './models/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryprt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AllowUserDto, CreateUserDto } from './dto';
import { TOTPUserSettingsGeneral } from 'src/mfa-auth/mfa-totp-auth/mfa-totp-general.service';
import { GeneralResponse } from './interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly totpUserSettingsGeneral: TOTPUserSettingsGeneral,
    private jwt: JwtService,
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
      const cookie: any = await this.getCookieWithJwtToken(user._id);
      res.setHeader('Set-Cookie', cookie);
      user.password = undefined;
      const toBeReturned: GeneralResponse = {
        statusCode: HttpStatus.OK,
        message: 'User can Log in',
      };
      return res.send(toBeReturned);
    }
  }
  public getCookieForLogOut(): string {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
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
    const cookie: string = await this.getCookieWithJwtAccessToken(id, true);

    res.setHeader('Set-Cookie', cookie);

    return {
      statusCode: HttpStatus.OK,
      message: 'TOTP verified!',
    };
  }

  async getCookieWithJwtToken(id: any): Promise<string> {
    const user: User = await this.userModel.findById(id);
    const username: string = user.username;
    const mfa_status: string = user.mfa.status;
    const payload = {
      sub: id,
      username,
      mfa_status,
    };
    const token: string = await this.jwt.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
      privateKey: Buffer.from(process.env.PRIV_KEY, 'base64').toString('ascii'),
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`;
  }
  // by this isSecondFactorAuthenticated property, we can now distinguish
  // between tokens created with and without two-factor authentication.
  async getCookieWithJwtAccessToken(
    id: string,
    isSecondFactorAuthenticated: boolean,
  ): Promise<string> {
    const user: User = await this.userModel.findById(id);
    const username: string = user.username;
    const mfa_status: string = user.mfa.status;
    const payload = {
      sub: id,
      username,
      mfa_status,
      isSecondFactorAuthenticated,
    };
    const token: string = await this.jwt.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
      privateKey: Buffer.from(process.env.PRIV_KEY, 'base64').toString('ascii'),
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`;
  }
}
