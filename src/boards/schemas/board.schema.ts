import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Team } from '../../teams/schemas/team.schema';

export type BoardDocument = Board & mongoose.Document;

@Schema()
export class ColumnCard {
  @Prop()
  title: string;
}

const ColumnCardSchema = SchemaFactory.createForClass(ColumnCard);

@Schema()
class BoardColumn {
  @Prop()
  title: string;

  @Prop()
  color: string;

  @Prop({ type: [ColumnCardSchema] })
  cards: ColumnCard[];
}

const BoardColumnSchema = SchemaFactory.createForClass(BoardColumn);

@Schema({ _id: false })
class BoardUser {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  _user: User | mongoose.Schema.Types.ObjectId;

  @Prop()
  role: string;
}

const BoardUserSchema = SchemaFactory.createForClass(BoardUser);

@Schema()
export class Board {
  @Prop()
  title: string;

  @Prop()
  isPublic: boolean;

  @Prop()
  password: string;

  @Prop()
  maxVotesPerUser: number;

  @Prop({ type: Date })
  submittedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  _createdByUser: User | mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  _submittedByUser: User | mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Team' })
  _team: Team | mongoose.Schema.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }] })
  _dividedBoards: Board[];

  @Prop({ type: [BoardUserSchema] })
  users: BoardUser[];

  @Prop({ type: [BoardColumnSchema] })
  columns: BoardColumn[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
