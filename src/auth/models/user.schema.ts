import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address, UserPlan, VaultOwn, VaultShared } from './index';
import { Document } from 'mongoose';
import { Exclude, Type } from 'class-transformer';
import {
  AddressSchema,
  UserPlanSchema,
  VaultOwnSchema,
  VaultSharedSchema,
} from './index';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ unique: false, type: String })
  fullName: string;

  @Prop({ unique: true, type: String, lowercase: true })
  emailId: string;

  @Prop({ unique: true, type: Number })
  phoneNumber: number;

  @Prop({ unique: true, type: String })
  username: string;

  @Prop({ unique: false, type: Boolean, default: false })
  admin: boolean;

  @Prop({ unique: false, type: String, default: null })
  group_head_of: string;

  @Prop({ type: AddressSchema })
  @Type(() => Address)
  address: Address;

  @Prop({ type: UserPlanSchema, default: {} })
  @Type(() => UserPlan)
  current_plan: UserPlan;

  @Exclude()
  @Prop({ unique: false, type: String })
  password: string;

  @Prop({ unique: false, type: Boolean, default: false })
  mfa_status: boolean;

  @Prop({ unique: false, type: String, default: null })
  secret_link: string;

  @Prop({ unique: false, type: String, default: null })
  secret_32: string;

  @Prop({ required: false, type: VaultOwnSchema, default: {} })
  @Type(() => VaultOwn)
  vault_own: VaultOwn;

  @Prop({ required: false, type: VaultSharedSchema, default: {} })
  @Type(() => VaultShared)
  vault_shared: VaultShared;
}

export const UserSchema = SchemaFactory.createForClass(User);
