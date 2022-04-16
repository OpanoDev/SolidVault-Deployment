import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from './models/user.schema';
import { JwtStrategy } from './strategy/jwt.strategy';
import * as bcryprt from 'bcrypt';
import { TOTPUserSettingsGeneral } from 'src/mfa-auth/mfa-totp-auth/mfa-totp-general.service';
import { JwtTwoFactorStrategy } from './strategy/jwt-mfa.strategy';
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => {
        const options: JwtModuleOptions = {
          privateKey: Buffer.from(process.env.PRIV_KEY, 'base64').toString(
            'ascii',
          ),
          publicKey: Buffer.from(process.env.PUB_KEY, 'base64').toString(
            'ascii',
          ),
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
  ],
})
export class Auth {}
