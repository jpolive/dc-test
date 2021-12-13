import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './schemas/team.schema';
import { Model } from 'mongoose';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team.name) private teamModel: Model<TeamDocument>) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    return await this.teamModel.create(createTeamDto);
  }

  async findAll(): Promise<Team[]> {
    return this.teamModel
      .find()
      .populate({
        path: 'users',
        populate: { path: '_user', select: '_id name' },
      })
      .exec();
  }
}
