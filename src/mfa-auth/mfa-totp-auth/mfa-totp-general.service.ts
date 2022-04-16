import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/models';
import { Model } from 'mongoose';
import { authenticator } from 'otplib';
import { GeneralResponse } from 'src/auth/interface';
import { TOTPStatus } from './interfaces';

@Injectable()
export class TOTPUserSettingsGeneral {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async showMFAStatus(id: string): Promise<TOTPStatus> {
    const user = await this.userModel.findById(id);
    if (!user) throw new UnauthorizedException('No User Found');
    const { status, type } = user.mfa;
    return {
      status,
      type,
    };
  }

  async setTwoFactorAuthenticationSecret(
    id: string,
    secret: string,
  ): Promise<string> {
    const updates = {
      mfa: {
        type: 'totp',
        secret: secret,
      },
    };
    const user = await this.userModel.findByIdAndUpdate(id, updates);
    if (user) return 'Updated The secret';
  }

  async enableMFA(id: string): Promise<GeneralResponse> {
    this.userModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { 'mfa.status': 'enabled' },
      },
      function (err: Error, doc) {
        if (err) throw new BadRequestException('Cannot add totp feature');
      },
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'TOTP Enabled',
    };
  }

  async diableMFA(id: string): Promise<GeneralResponse> {
    const updates = {
      mfa: {},
    };
    const upUser = await this.userModel.findByIdAndUpdate(id, updates);
    if (!upUser) throw new BadRequestException('Error Occured');
    return {
      statusCode: HttpStatus.OK,
      message: 'MFA Disabled',
    };
  }
  public isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    secret: string,
  ) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: secret,
    });
  }
}
