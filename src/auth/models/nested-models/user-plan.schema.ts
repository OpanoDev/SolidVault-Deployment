import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserPlanDocument = UserPlan & Document;

@Schema({ _id: false })
export class UserPlan extends Document {
  // free, family, personal, enterprise
  @Prop({ default: 'free', type: String })
  plan: string;

  // free-user || family-user-head, family-user ||  personal-user || enterpise-admin, enterprise-employee
  @Prop({ default: 'free-user', type: String })
  group: string;
}

export const UserPlanSchema = SchemaFactory.createForClass(UserPlan);
