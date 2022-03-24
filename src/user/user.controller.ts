import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userSrvice: UserService) {}
  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  userData(@Req() req: Request): string {
    return this.userSrvice.userData(req);
  }
}
