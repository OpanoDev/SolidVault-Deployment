import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/models/user.schema';
import { UpdateUserDto, ReqUserDto } from '../dto';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  userData(reqUserDto: ReqUserDto): string {
    return `Welcome ${reqUserDto.username}`;
  }

  async updateUserData(updateUserDto: UpdateUserDto, reqUserDto: ReqUserDto) {
    const options = { new: true };
    const upUser = await this.userModel.findByIdAndUpdate(
      reqUserDto.sub,
      updateUserDto,
      options,
    );
    if (!upUser) throw new BadRequestException('No User Found');

    return upUser;
  }

  async deleteUser(reqUserDto: ReqUserDto) {
    const user = await this.userModel.findByIdAndDelete(reqUserDto.sub);
    if (!user) throw new BadRequestException('User Not Found');

    return 'User Deleted';
  }
}
