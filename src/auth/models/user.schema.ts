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
}

export const UserSchema = SchemaFactory.createForClass(User);
