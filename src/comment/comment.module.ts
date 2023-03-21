import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepository } from 'src/common/repository/comment.repository';
import { NewsfeedRepository } from 'src/common/repository/newsfeed.repository';
import { Comment } from 'src/database/entities/comment.entity';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { User } from 'src/database/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, NewsFeed, User])],
  controllers: [CommentController],
  providers: [
    CommentService,
    NewsfeedRepository,
    CommentRepository,
    UserService,
  ],
})
export class CommentModule {}
