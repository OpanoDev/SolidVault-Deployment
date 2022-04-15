import { Module } from '@nestjs/common';
import { Auth } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MfaAuthModule } from './mfa-auth/mfa-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    Auth,
    MongooseModule.forRoot(process.env.DB_URI),
    UserModule,
    MfaAuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
