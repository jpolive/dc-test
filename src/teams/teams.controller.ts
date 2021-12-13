import { Body, Controller, Get, Post } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './schemas/team.schema';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    await this.teamsService.create(createTeamDto);
  }

  @Get()
  async findAll(): Promise<Team[]> {
    return this.teamsService.findAll();
  }
}
