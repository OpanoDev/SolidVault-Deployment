import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectID } from 'bson';

export type VaultSharedDocument = VaultShared & Document;

@Schema({ _id: false })
export class VaultShared {
  @Prop()
  shared: [
    {
      type: string; // family or enterprise
      group_name: string;
      item: ObjectID;
    },
  ];
}
export const VaultSharedSchema = SchemaFactory.createForClass(VaultShared);
