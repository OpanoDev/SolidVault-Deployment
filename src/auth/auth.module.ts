import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from './models/user.schema';
import * as bcryprt from 'bcrypt';
import { TOTPUserSettingsGeneral } from 'src/mfa-auth/mfa-totp-auth/mfa-totp-general.service';
import { CookieSettings } from './cookie.services';
import {
  JwtRefreshStrategy,
  JwtTwoFactorStrategy,
  JwtStrategy,
} from './strategy';
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => {
        const options: JwtModuleOptions = {
          signOptions: {
            expiresIn: process.env.JWT_EXPIRATION_TIME,
            algorithm: 'RS256',
          },
        };
        return options;
      },
    }),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;

          schema.pre<User>('save', async function () {
            const user: User = this;
            const hashedPassword: string = await bcryprt.hash(
              user.password,
              10,
            );
            user.password = hashedPassword;
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TOTPUserSettingsGeneral,
    JwtStrategy,
    JwtTwoFactorStrategy,
    JwtRefreshStrategy,
    CookieSettings,
  ],
})
export class Auth {}
