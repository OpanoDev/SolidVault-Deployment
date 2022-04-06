import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { User, UserDocument } from './models/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { verifyTOTP } from 'utils';
import { MFASignin, UserSignin, UserSignup } from './interface';

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
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  async signin(userSignin: UserSignin): Promise<any> {
    const user = await this.userModel.findOne({
      emailId: userSignin.emailId,
    });
    console.log(user);
    if (user === null) throw new BadRequestException('User Not Found');
    if (!user) throw new BadRequestException('Credentials Incorrect!');
    const valid = await argon2.verify(user.password, userSignin.password);
    if (!valid) throw new BadRequestException('Credential Incorrect!');

    if (user.mfa_status == false) {
      if (valid && user) {
        const token = await this.signToken(user._id, user.username);
        return {
          access_token: token,
        };
      }
      return 'Error Occuered';
    } else {
      if (valid && user) return 'Success, totp verification is pending!';
    }
  }

  async mfaSignin(code: string, username: string): Promise<MFASignin> {
    const user = await this.userModel.findOne({ username: username });
    if (!user) throw new BadRequestException('User not Found!!');
    const { verified } = verifyTOTP(user.secret_32, code);

    if (verified === true) {
      const token = await this.signToken(user._id, user.username);
      return {
        verified,
        access_token: token,
      };
    } else
      return {
        verified,
      };
  }

  async signToken(id: any, username: string): Promise<string> {
    const payload = {
      sub: id,
      username,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15min',
      privateKey: Buffer.from(process.env.PRIV_KEY, 'base64').toString('ascii'),
    });
    return token;
  }
}
