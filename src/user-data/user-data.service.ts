import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/models';
import { Model } from 'mongoose';
import { UserDeviceDto } from './dto/user-device.dto';
import { GeneralResponse } from 'src/auth/interface';

@Injectable()
export class UserDataService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  //   public addDeviceInfoOnLogin(id: string) {
  //     const osInfo: object = platform.os;
  //     return {
  //       name: platform.name,
  //       version: platform.version,
  //       layout: platform.layout,
  //       osInfo,
  //       product: platform.product,
  //       description: platform.description,
  //     };
  //   }

  // *** We should Get Data processed from frontend only as soon as User Logs In ***!!
  addDeviceInfoOnLogin(id: string, updates: UserDeviceDto): GeneralResponse {
    this.userModel.findByIdAndUpdate(
      id,
      {
        $set: { userDevices: updates },
      },
      function (err: Error, doc: User) {
        if (err) throw new BadRequestException('Not Updated');
      },
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Added!',
    };
  }
}
