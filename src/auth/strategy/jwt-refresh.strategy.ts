import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/user.schema';
import { Model } from 'mongoose';
import { Request } from 'express';
import { CookieSettings } from '../cookie.services';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-cookie',
) {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly cookieSettings: CookieSettings,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: Buffer.from(
        process.env.JWT_PUB_KEY_REFRESH,
        'base64',
      ).toString('ascii'),
      passReqToCallback: true,
      algorithms: ['RS256'],
    });
  }
  async validate(request: Request, payload: any) {
    const refreshToken = request.cookies?.Refresh;
    const result = this.cookieSettings.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.sub,
    );
    if (result) return payload;
  }
}
