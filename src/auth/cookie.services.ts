import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TOTPUserSettingsGeneral } from 'src/mfa-auth/mfa-totp-auth/mfa-totp-general.service';
import { User, UserDocument } from './models';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CookieSettings {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwt: JwtService,
  ) {}
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
      privateKey: Buffer.from(process.env.JWT_PRIV_KEY, 'base64').toString(
        'ascii',
      ),
    });
    const cookie: string = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`;
    return cookie;
  }
  async getCookieWithJwtRefreshToken(id: any): Promise<any> {
    const user: User = await this.userModel.findById(id);
    const username: string = user.username;
    const mfa_status: string = user.mfa.status;
    const payload = {
      sub: id,
      username,
      mfa_status,
    };
    const token: string = await this.jwt.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRATION_TIME_REFRESH,
      privateKey: Buffer.from(
        process.env.JWT_PRIV_KEY_REFRESH,
        'base64',
      ).toString('ascii'),
    });
    const cookie: string = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME_REFRESH}`;
    return { refreshCookie: cookie, refreshToken: token };
  }

  // by this isSecondFactorAuthenticated property, we can now distinguish
  // between tokens created with and without two-factor authentication.
  async getCookieWithJwtAccessTokenMFA(
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
      privateKey: Buffer.from(process.env.JWT_PRIV_KEY, 'base64').toString(
        'ascii',
      ),
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`;
  }
  async setCurrentRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    id: string,
  ): Promise<boolean> {
    const user: User = await this.userModel.findById(id);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return true;
    }
  }

  async removeRefreshToken(id: string): Promise<void> {
    return this.userModel.findByIdAndUpdate(id, {
      currentHashedRefreshToken: null,
    });
  }
}
