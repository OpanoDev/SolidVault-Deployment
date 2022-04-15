import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MFADocument = MFA & Document;

@Schema({ _id: false })
export class MFA extends Document {
  @Prop({ type: String, default: 'disabled' })
  status: string;

  //   mobile or email or totp
  @Prop({ type: String, default: null })
  type: string;

  @Prop({ type: String, default: null })
  secret: string;
}

export const MFASchema = SchemaFactory.createForClass(MFA);
