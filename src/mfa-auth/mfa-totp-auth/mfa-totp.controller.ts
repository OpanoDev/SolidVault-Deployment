import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { GetCurrentUserById } from 'src/auth/decorators/getuserid.decorator';
import { User, UserDocument } from 'src/auth/models';
import { Model } from 'mongoose';
import { TOTPService } from './mfa-totp.service';
import { TOTPUserSettingsGeneral } from './mfa-totp-general.service';
import { JwtTwoFactorGuard } from 'src/auth/guards';
import { GeneralResponse } from 'src/auth/interface';
import { TOTPStatus } from './interfaces';

@Controller('/totp')
@UseGuards(JwtTwoFactorGuard)
export class TOTPController {
  constructor(
    private readonly totpService: TOTPService,
    private readonly totpUserSettingsGeneral: TOTPUserSettingsGeneral,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  @Post('/generate-qr')
  async setFirstTotp(
    @Res() response: Response,
    @GetCurrentUserById() id: string,
  ) {
    const user: User = await this.userModel.findById(id);
    const { otpauthUrl } =
      this.totpService.generateTwoFactorAuthenticationSecret(user);
    return this.totpService.getTotpQr(response, otpauthUrl);
  }

  @Post('/turn-on')
  async firstTotpVerification(
    @GetCurrentUserById() id: string,
    @Body() { totp_code }: any,
  ): Promise<GeneralResponse> {
    const user: User = await this.userModel.findById(id);
    if (user.mfa.secret == null)
      throw new BadRequestException('TOTP is not enabled');
    const isCodeValid = this.totpService.firstTotpVerification(
      totp_code,
      user.mfa.secret,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    return await this.totpUserSettingsGeneral.enableMFA(id);
  }

  @Get('/turn-off')
  async removeTOTP(@GetCurrentUserById() id: string): Promise<GeneralResponse> {
    return await this.totpUserSettingsGeneral.diableMFA(id);
  }

  @Get('/status')
  async getTOTPStatus(@GetCurrentUserById() id: string): Promise<TOTPStatus> {
    return await this.totpUserSettingsGeneral.showMFAStatus(id);
  }
}
