import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from '../services/user.service';
import { ReqUserDto, UpdateUserDto } from '../dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  userData(@Req() req: Request): string {
    return this.userService.userData(req.user);
  }

  @Put('/update-me')
  @UseGuards(AuthGuard('jwt'))
  updateUserData(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserData(updateUserDto, req.user);
  }

  @Delete('/delete-me')
  @UseGuards(AuthGuard('jwt'))
  deleteUser(@Req() req: Request) {
    return this.userService.deleteUser(req.user);
  }
}
