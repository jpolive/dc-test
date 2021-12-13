import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { BoardsModule } from './boards/boards.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      // 'mongodb://admin:password@localhost:27017/dc?authSource=admin',
      'mongodb+srv://<user>:<password>@cluster0.cbqwc.mongodb.net/dc?retryWrites=true&w=majority',
    ),
    UsersModule,
    TeamsModule,
    BoardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
