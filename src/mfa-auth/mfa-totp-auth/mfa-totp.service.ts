import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { User, UserDocument } from 'src/auth/models';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TOTPUserSettingsGeneral } from './mfa-totp-general.service';
import { GenerateTotp } from './interfaces';

@Injectable()
export class TOTPService {
  constructor(
    private readonly totpUserSettingsGeneral: TOTPUserSettingsGeneral,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  generateTwoFactorAuthenticationSecret(user: User): GenerateTotp {
    const secret: string = authenticator.generateSecret();

    const otpauthUrl: string = authenticator.keyuri(
      user.emailId,
      process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
      secret,
    );

    this.totpUserSettingsGeneral.setTwoFactorAuthenticationSecret(
      user._id,
      secret,
    );

    return {
      secret,
      otpauthUrl,
    };
  }

  public async getTotpQr(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  firstTotpVerification(two_factor_code: string, secret: string): boolean {
    return authenticator.verify({
      token: two_factor_code,
      secret: secret,
    });
  }
}
