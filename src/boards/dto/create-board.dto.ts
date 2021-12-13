import * as mongoose from 'mongoose';

export class CreateBoardDto {
  readonly title: string;
  readonly isPublic: boolean;
  readonly password: string;
  readonly maxVotesPerUser: number;
  readonly _createdByUser: mongoose.Schema.Types.ObjectId;
  readonly _team: mongoose.Schema.Types.ObjectId;
  readonly _dividedBoards: mongoose.Schema.Types.ObjectId[];
  readonly users: {
    _user: mongoose.Schema.Types.ObjectId;
    role: string;
  }[];
  readonly columns: {
    readonly title: string;
    readonly color: string;
    readonly cards: [];
  }[];
}