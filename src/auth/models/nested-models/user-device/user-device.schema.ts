import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document } from 'mongoose';
import { UserDeviceOs, UserDeviceOsSchema } from './user-device-os.schema';

export type UserDeviceDocument = UserDevice & Document;

@Schema({ _id: false })
export class UserDevice extends Document {
  @Prop({ default: null, type: String })
  name: string;

  @Prop({ default: null, type: String })
  version: string;

  @Prop({ default: null, type: String })
  layout: string;

  @Prop({ default: null, type: String })
  product: string;

  @Prop({ type: UserDeviceOsSchema, default: {} })
  @Type(() => UserDeviceOs)
  osInfo: UserDeviceOs;

  @Prop({ default: null, type: String })
  description: string;

  @Prop({ default: false, type: Boolean })
  isLoggedIn: boolean;

  @Prop({ default: null, type: String })
  ipAddress: string;
}

export const UserDeviceSchema = SchemaFactory.createForClass(UserDevice);
