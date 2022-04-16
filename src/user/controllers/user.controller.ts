import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dto';
import { GetCurrentUserById } from 'src/auth/decorators/getuserid.decorator';
import { JwtTwoFactorGuard } from 'src/auth/guards';

@Controller('user')
@UseGuards(JwtTwoFactorGuard)
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
