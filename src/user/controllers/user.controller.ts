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
import { GetCurrentUserById } from 'src/auth/decorators/getuserid.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  userData(@GetCurrentUserById() id: string): Promise<string> {
    return this.userService.userData(id);
  }

  @Put('/update-me')
  @UseGuards(AuthGuard('jwt'))
  updateUserData(
    @GetCurrentUserById() id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserData(updateUserDto, id);
  }

  @Delete('/delete-me')
  @UseGuards(AuthGuard('jwt'))
  deleteUser(@GetCurrentUserById() id: string) {
    return this.userService.deleteUser(id);
  }
}
