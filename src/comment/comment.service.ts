import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsfeedRepository } from 'src/common/repository/newsfeed.repository';
import { Comment } from 'src/database/entities/comment.entity';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { Repository } from 'typeorm';
import { CommentDTO } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(NewsFeed)
    private readonly newsfeedRepository: Repository<NewsFeed>,
    private readonly newsfeedCustomRepository: NewsfeedRepository,
  ) {}

  // 댓글 생성
  async createComment(userId: number, newsfeedId: number, data: CommentDTO) {
    await this.commentRepository.save({
      newsfeed: { id: newsfeedId },
      user: { id: userId },
      content: data.content,
    });
  }

  // 뉴스피드 게시물에 대한 모든 댓글 조회
  async getCommentByNewsfeed(newsfeedId: number): Promise<NewsFeed> {
    return await this.newsfeedRepository.findOne({
      select: ['id', 'comment'],
      relations: ['comment'],
      where: { id: newsfeedId },
    });
  }

  // 댓글 수정
  async modifyComment(
    userId: number,
    newsfeedId: number,
    commentId: number,
    data: CommentDTO,
  ) {
    const checkNewsfeed = await this.newsfeedCustomRepository.checkNewsfeed(
      newsfeedId,
    );
    const content = data.content;
    const checkUserId = checkNewsfeed.user['id'];
    if (!checkNewsfeed) {
      throw new NotFoundException('뉴스피드를 찾을 수 없습니다.');
    } else if (userId !== checkUserId) {
      throw new ForbiddenException('권한이 존재하지 않습니다.');
    } else {
      await this.commentRepository.update(commentId, { content });
    }
  }

  // 댓글 삭제
  async deleteComment(userId: number, newsfeedId: number, commentId: number) {
    await this.commentRepository.softDelete({
      id: commentId,
      user: { id: userId },
      newsfeed: { id: newsfeedId },
    });
  }
}
