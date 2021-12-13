import * as mongoose from 'mongoose';

export class CreateTeamDto {
  readonly name: string;
  readonly users: {
    _user: mongoose.Schema.Types.ObjectId;
    role: string;
  }[];
}
