import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserSettingsService } from '../services/index';
import { GetCurrentUserById } from 'src/auth/decorators/getuserid.decorator';
import { FirstMFADto } from '../dto/index';
import { SetMfa } from '../interfaces/index';

@Controller('/api/user-settings')
@UseGuards(AuthGuard('jwt'))
export class UserSettingsController {
  constructor(private userSettingsService: UserSettingsService) {}

  @Get('/show-mfa')
  showMFA(@GetCurrentUserById() userId: number): Promise<string> {
    return this.userSettingsService.showMFA(userId);
  }

  @Get('/set-mfa')
  setMFA(@GetCurrentUserById() userId: number): Promise<SetMfa> {
    return this.userSettingsService.setMFA(userId);
  }

  @Post('/first-mfa-auth')
  firstMFA(@Body() firstMFADto: FirstMFADto, @GetCurrentUserById() id: number) {
    const { code, secret_32, secret_link } = firstMFADto;
    return this.userSettingsService.firstMFA(secret_32, code, secret_link, id);
  }
}
