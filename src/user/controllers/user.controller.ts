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
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dto';
import { GetCurrentUserById } from 'src/auth/decorators/getuserid.decorator';
import { TotpGuard } from 'src/auth/guards/totp.guard';

@Controller('user')
@UseGuards(AuthGuard('jwt'), TotpGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/me')
  userData(@GetCurrentUserById() id: string): Promise<string> {
    return this.userService.userData(id);
  }

  @Put('/update-me')
  updateUserData(
    @GetCurrentUserById() id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserData(updateUserDto, id);
  }

  @Delete('/delete-me')
  deleteUser(@GetCurrentUserById() id: string) {
    return this.userService.deleteUser(id);
  }
}
