import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from './models/user.schema';
import { JwtStrategy } from './strategy/jwt.strategy';
import * as argon2 from 'argon2';

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
            expiresIn: '15min',
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
            const hashedPassword: string = await argon2.hash(user.password);
            user.password = hashedPassword;
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class Auth {}
