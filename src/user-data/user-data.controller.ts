import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUserById } from 'src/auth/decorators/getuserid.decorator';
import { JwtTwoFactorGuard } from 'src/auth/guards';
import { GeneralResponse } from 'src/auth/interface';
import { UserDeviceDto } from './dto/user-device.dto';
import { UserDataService } from './user-data.service';

@Controller('user-data')
@UseGuards(JwtTwoFactorGuard)
export class UserDataController {
  constructor(private readonly userDataService: UserDataService) {}
  @Post('/device-info')
  addDeviceInfoOnLogin(
    @GetCurrentUserById() id: string,
    @Body() updatesDto: UserDeviceDto,
  ): GeneralResponse {
    return this.userDataService.addDeviceInfoOnLogin(id, updatesDto);
  }
}
