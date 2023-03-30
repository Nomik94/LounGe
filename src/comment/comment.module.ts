import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepository } from 'src/common/repository/comment.repository';
import { NewsfeedRepository } from 'src/common/repository/newsfeed.repository';
import { UserGroupRepository } from 'src/common/repository/user.group.repository';
import { UserRepository } from 'src/common/repository/user.repository';
import { Comment } from 'src/database/entities/comment.entity';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { User } from 'src/database/entities/user.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, NewsFeed, User, UserGroup])],
  controllers: [CommentController],
  providers: [
    CommentService,
    NewsfeedRepository,
    CommentRepository,
    UserRepository,
    UserGroupRepository,
  ],
})
export class CommentModule {}
