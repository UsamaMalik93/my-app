import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Package extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Service' }] })
  //this is to ref to other collection in Mongodb collection & services field will store array of obj id
  services: Types.Array<Types.ObjectId>; 
}

export const PackageSchema = SchemaFactory.createForClass(Package);
