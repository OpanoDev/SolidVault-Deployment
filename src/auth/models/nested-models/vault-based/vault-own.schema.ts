import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectID } from 'bson';
import { Document } from 'mongoose';

export type VaultOwnDocument = VaultOwn & Document;

@Schema({ _id: false })
export class VaultOwn {
  @Prop()
  own: [
    {
      type: string; // password || Card || Secure note || documents
      item: ObjectID;
    },
  ];
}

export const VaultOwnSchema = SchemaFactory.createForClass(VaultOwn);
