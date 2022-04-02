import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/models/user.schema';
import { UserController, UserSettingsController } from './controllers/index';
import { UserService, UserSettingsService } from './services/index';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController, UserSettingsController],
  providers: [UserService, UserSettingsService],
})
export class UserModule {}
