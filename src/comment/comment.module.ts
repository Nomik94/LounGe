import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsfeedRepository } from 'src/common/repository/newsfeed.repository';
import { Comment } from 'src/database/entities/comment.entity';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, NewsFeed])],
  controllers: [CommentController],
  providers: [CommentService, NewsfeedRepository],
})
export class CommentModule {}
