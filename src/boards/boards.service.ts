import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Board, BoardDocument } from './schemas/board.schema';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { UpdateCardPositionDto } from './dto/update-card-position.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    return await this.boardModel.create(createBoardDto);
  }

  async findAll(): Promise<Board[]> {
    return this.boardModel.find().exec();
  }

  async addCardToBoard(boardId: number, createCardDto: CreateCardDto) {
    return await this.boardModel
      .updateOne(
        {
          _id: boardId,
          'columns._id': createCardDto._column,
        },
        {
          $push: {
            'columns.$.cards': { title: createCardDto.title },
          },
        },
      )
      .exec();
  }

  async updateCard(
    boardId: number,
    cardId: number,
    updateCardDto: UpdateCardDto,
  ) {
    return await this.boardModel
      .updateOne(
        {
          _id: boardId,
          'columns.cards._id': cardId,
        },
        {
          $set: {
            'columns.$.cards.$[c].title': updateCardDto.title,
          },
        },
        {
          arrayFilters: [{ 'c._id': cardId }],
        },
      )
      .exec();
  }

  async getCardFromBoard(boardId: number, cardId: number) {
    const result = await this.boardModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(boardId),
          'columns.cards._id': new Types.ObjectId(cardId),
        },
      },
      {
        $unwind: {
          path: '$columns',
        },
      },
      {
        $unwind: {
          path: '$columns.cards',
        },
      },
      {
        $project: {
          card: '$columns.cards',
          _id: 0,
        },
      },
      {
        $replaceRoot: {
          newRoot: '$card',
        },
      },
      {
        $match: {
          _id: new Types.ObjectId(cardId),
        },
      },
    ]);

    return result.length === 1 ? result[0] : null;
  }

  async updateCardPosition(
    boardId: number,
    cardId: number,
    updateCardPositionDto: UpdateCardPositionDto,
  ) {
    // const cardToMove = await this.getCardFromBoard(boardId, cardId);
    //
    // /*const t1 = */
    // await this.boardModel
    //   .updateOne(
    //     {
    //       _id: boardId,
    //       'columns.cards._id': cardId,
    //     },
    //     {
    //       $pull: {
    //         'columns.$[].cards': { _id: cardId },
    //       },
    //     },
    //   )
    //   .exec();
    //
    // // console.log(t1);
    //
    // /*const t2 = */
    // await this.boardModel
    //   .updateOne(
    //     {
    //       _id: boardId,
    //       'columns._id': updateCardPositionDto._column,
    //     },
    //     {
    //       $push: {
    //         'columns.$.cards': {
    //           $each: [cardToMove],
    //           $position: updateCardPositionDto.position,
    //         },
    //       },
    //     },
    //   )
    //   .exec();
    //
    // // console.log(t2);

    try {
      const session = await this.boardModel.db.startSession();
      session.startTransaction();

      try {
        const cardToMove = await this.getCardFromBoard(boardId, cardId);

        if (cardToMove) {
          const pullResult = await this.boardModel
            .updateOne(
              {
                _id: boardId,
                'columns.cards._id': cardId,
              },
              {
                $pull: {
                  'columns.$[].cards': { _id: cardId },
                },
              },
            )
            .session(session)
            .exec();

          console.log(pullResult);

          if (pullResult.modifiedCount !== 1) {
            await session.abortTransaction();
            return;
          }

          const pushResult = await this.boardModel
            .updateOne(
              {
                _id: boardId,
                'columns._id': updateCardPositionDto._column,
              },
              {
                $push: {
                  'columns.$.cards': {
                    $each: [cardToMove],
                    $position: updateCardPositionDto.position,
                  },
                },
              },
            )
            .session(session)
            .exec();

          console.log(pushResult);

          if (pushResult.modifiedCount !== 1) {
            await session.abortTransaction();
            return;
          }

          await session.commitTransaction();
        }
      } catch (e) {
        console.log('Transaction error: ', e);
        await session.abortTransaction();
      } finally {
        await session.endSession();
      }
    } catch (e) {
      console.log(e);
    }
  }
}
