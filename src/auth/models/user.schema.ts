import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: false, type: String })
  fullName: string;

  @Prop({ unique: true, type: String })
  emailId: string;

  @Prop({ unique: true, type: Number })
  phoneNumber: number;

  @Prop({ unique: true, type: String })
  username: string;

  @Prop({ unique: false, type: String })
  password: string;

  @Prop({ unique: false, type: Boolean, default: false })
  mfa_status: boolean;

  @Prop({ unique: true, type: String, default: '' })
  secret_link: string;

  @Prop({ unique: true, type: String, default: '' })
  secret_32: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
