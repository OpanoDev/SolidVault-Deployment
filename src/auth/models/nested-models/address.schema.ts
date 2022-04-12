import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AddressDocument = Address & Document;

@Schema({ _id: false })
export class Address extends Document {
  @Prop({ unique: false })
  address_line: string;

  @Prop({ unique: false })
  city: string;

  @Prop({ unique: false })
  country: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
