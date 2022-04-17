import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDeviceOsDocument = UserDeviceOs & Document;

@Schema({ _id: false })
export class UserDeviceOs extends Document {
  @Prop({ default: null, type: String })
  architecture: string;

  @Prop({ default: null, type: String })
  family: string;

  @Prop({ default: null, type: String })
  version: string;
}

export const UserDeviceOsSchema = SchemaFactory.createForClass(UserDeviceOs);
