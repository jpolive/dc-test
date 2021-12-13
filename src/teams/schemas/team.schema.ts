import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type TeamDocument = Team & mongoose.Document;

@Schema({ _id: false })
class TeamUser {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  _user: User | mongoose.Schema.Types.ObjectId;

  @Prop()
  role: string;
}

const TeamUserSchema = SchemaFactory.createForClass(TeamUser);

@Schema()
export class Team {
  @Prop()
  name: string;

  @Prop({ type: [TeamUserSchema] })
  users: TeamUser[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
