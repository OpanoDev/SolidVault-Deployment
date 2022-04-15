import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/models';
import { Model } from 'mongoose';

@Injectable()
export class TOTPUserSettingsGeneral {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async showMFAStatus(id: string): Promise<any> {
    const user = await this.userModel.findById(id);
    if (!user) throw new UnauthorizedException('No User Found');
    const { status, type } = user.mfa;
    return {
      status,
      type,
    };
  }

  async setTwoFactorAuthenticationSecret(id: string, secret: string) {
    const updates = {
      mfa: {
        type: 'totp',
        secret: secret,
      },
    };
    const user = await this.userModel.findByIdAndUpdate(id, updates);
    if (user) return 'Updated The secret';
  }

  async enableMFA(id: string) {
    this.userModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { 'mfa.status': 'enabled' },
      },
      function (err: Error, doc) {
        if (err) throw new BadRequestException('Cannot add totp feature');
      },
    );
    return 'TOTP Enabled';
  }

  async diableMFA(id: string) {
    const updates = {
      mfa: {},
    };
    const upUser = await this.userModel.findByIdAndUpdate(id, updates);
    if (upUser) return 'MFA Disabled';
    else throw new BadRequestException('Error Occured');
  }
}
