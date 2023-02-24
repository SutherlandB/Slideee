import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type GroupDocument = HydratedDocument<Group>;

@Schema()
export class Group {
  @Prop()
  groupName: string;

  @Prop()
  displayName: string;

  @Prop()
  isPrivate: Boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  Owner: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  Admins: User[];//find right type
}
const GroupSchema = SchemaFactory.createForClass(Group)

export {GroupSchema};