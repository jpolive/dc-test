import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './schemas/board.schema';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { UpdateCardPositionDto } from './dto/update-card-position.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly teamsService: BoardsService) {}

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto) {
    await this.teamsService.create(createBoardDto);
  }

  @Get()
  async findAll(): Promise<Board[]> {
    return this.teamsService.findAll();
  }

  @Post(':boardId/card')
  async addCard(
    @Param('boardId') boardId: number,
    @Body() createCardDto: CreateCardDto,
  ) {
    await this.teamsService.addCardToBoard(boardId, createCardDto);
  }

  @Patch(':boardId/card/:cardId')
  async updateCard(
    @Param('boardId') boardId: number,
    @Param('cardId') cardId: number,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    await this.teamsService.updateCard(boardId, cardId, updateCardDto);
  }

  @Post(':boardId/card/:cardId')
  async updateCardPosition(
    @Param('boardId') boardId: number,
    @Param('cardId') cardId: number,
    @Body() updateCardPositionDto: UpdateCardPositionDto,
  ) {
    await this.teamsService.updateCardPosition(
      boardId,
      cardId,
      updateCardPositionDto,
    );
  }
}
