import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  userData(req): string {
    console.log(req.user);
    return `Welcome ${req.user.fullName}`;
  }
}
