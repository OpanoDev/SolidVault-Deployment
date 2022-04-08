import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/models/user.schema';
import { Model } from 'mongoose';
import { genSecret, verifyTOTP } from '../../../utils';
import { SetMfa } from '../interfaces/index';

@Injectable()
export class UserSettingsService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async showMFA(id: number): Promise<string> {
    const user = await this.userModel.findById(id);
    if (user.mfa_status === true) return 'Enabled';
    else return 'Disabled';
  }

  async setMFA(id: number): Promise<SetMfa> {
    const user = await this.userModel.findById(id);
    if (user.mfa_status === false) {
      const { secret_32, secret_link } = genSecret();
      // const scan: string = await qrcode.toDataURL(secret_link);
      return {
        secret_link,
        secret_32,
      };
    } else {
      return { status: 'Enabled already' };
    }
  }
  async firstMFA(
    secret_32: string,
    code: string,
    secret_link: string,
    id: number,
  ): Promise<string> {
    const { verified } = verifyTOTP(secret_32, code);
    const updates = { mfa_status: true, secret_32, secret_link };
    if (verified === true) {
      const upUser = await this.userModel.findByIdAndUpdate(id, updates);
      if (upUser) return 'MFA Activated';
    } else throw new BadRequestException('Error Occured');
  }
  async diableMFA(id: number) {
    const updates = {
      mfa_status: false,
      secret_32: null,
      secret_link: null,
    };
    const upUser = await this.userModel.findByIdAndUpdate(id, updates);
    if (upUser) return 'MFA Disabled';
    else throw new BadRequestException('Error Occured');
  }
}
