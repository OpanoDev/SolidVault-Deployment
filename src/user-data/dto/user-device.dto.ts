import { IsOptional } from 'class-validator';

class OsInfo {
  @IsOptional()
  readonly architecture: 64;
  @IsOptional()
  readonly family: 'Win32';
  @IsOptional()
  readonly version: null;
}

export class UserDeviceDto {
  @IsOptional()
  readonly name: string;
  @IsOptional()
  readonly version: string;
  @IsOptional()
  readonly layout: string;
  @IsOptional()
  readonly osInfo: OsInfo;
  @IsOptional()
  readonly description: string;
  @IsOptional()
  readonly isLoggedIn: boolean;
  @IsOptional()
  readonly ipAddress: string;
}
