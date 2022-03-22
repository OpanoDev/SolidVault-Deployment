import { Injectable } from '@nestjs/common';
import { UserSignin } from './interface/allow-user.interface';
import { UserSignup } from './interface/create-user.interface';

@Injectable()
export class AuthService {
  signup(userSignup: UserSignup): UserSignup {
    return userSignup;
  }
  signin(userSignin: UserSignin): UserSignin {
    return userSignin;
  }
}
