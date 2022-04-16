import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/models/user.schema';
import { UpdateUserDto } from '../dto';
import { Model } from 'mongoose';
import { GeneralResponse } from 'src/auth/interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async userData(id: string): Promise<string> {
    const user: User = await this.userModel.findById(id);
    return `Welcome ${user.fullName}`;
  }

  async updateUserData(
    updateUserDto: UpdateUserDto,
    id: string,
  ): Promise<GeneralResponse> {
    const options = { new: true };
    const upUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      options,
    );
    if (!upUser) throw new BadRequestException('No User Found');

    return {
      statusCode: HttpStatus.OK,
      message: 'User Updated!',
    };
  }

  async deleteUser(id: string): Promise<GeneralResponse> {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new BadRequestException('User Not Found');

    return {
      statusCode: HttpStatus.OK,
      message: 'User Deleted!',
    };
  }
}
