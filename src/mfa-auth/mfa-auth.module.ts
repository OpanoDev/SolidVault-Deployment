import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/models';
import { TOTPUserSettingsGeneral } from './mfa-totp-auth/mfa-totp-general.service';
import { TOTPController } from './mfa-totp-auth/mfa-totp.controller';
import { TOTPService } from './mfa-totp-auth/mfa-totp.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [TOTPController],
  providers: [TOTPService, TOTPUserSettingsGeneral],
})
export class MfaAuthModule {}
