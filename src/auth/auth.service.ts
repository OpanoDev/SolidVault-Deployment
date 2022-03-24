import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { UserSignin } from './interface/allow-user.interface';
import { UserSignup } from './interface/create-user.interface';
import { User, UserDocument } from './models/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwt: JwtService,
  ) {}

  async signup(userSignup: UserSignup): Promise<User> {
    // main logic
    try {
      if (userSignup.password !== userSignup.confirmPassword) {
        throw new ServiceUnavailableException('Passwords Mismatched!');
      } else {
        userSignup.password = await argon2.hash(userSignup.password);
        const createdUser = new this.userModel(userSignup);
        return createdUser.save();
      }
    } catch (err) {
      console.log(err);
    }
    return userSignup;
  }
  async signin(userSignin: UserSignin): Promise<any> {
    const user = await this.userModel
      .find({ emailId: userSignin.emailId })
      .lean();
    if (!user) throw new BadRequestException('Credentials Incorrect!');

    const valid = await argon2.verify(user[0].password, userSignin.password);
    if (!valid) throw new BadRequestException('Credential Incorrect!');

    if (valid && user) return this.signToken(user[0]._id, user[0].username);
    return 'Error Occuered';
  }

  async signToken(
    id: any,
    userName: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: id,
      userName,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15min',
      privateKey: Buffer.from(process.env.PRIV_KEY, 'base64').toString('ascii'),
    });
    return {
      access_token: token,
    };
  }
}
