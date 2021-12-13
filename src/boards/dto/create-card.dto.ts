import * as mongoose from 'mongoose';

export class CreateCardDto {
  readonly _column: mongoose.Schema.Types.ObjectId;
  readonly title: string;
}
