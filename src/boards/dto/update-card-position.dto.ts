import mongoose from 'mongoose';

export class UpdateCardPositionDto {
  readonly _column: mongoose.Schema.Types.ObjectId;
  readonly position: number;
}
