import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from 'src/common/repository/comment.repository';
import { NewsfeedRepository } from 'src/common/repository/newsfeed.repository';
import { UserService } from 'src/user/user.service';
import { CommentDTO } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly newsfeedRepository: NewsfeedRepository,
    private readonly userService: UserService,
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
  async getCommentByNewsfeed(userId: number, newsfeedId: number, page: number) {
    const pageSize = 10;
    const user = await this.userService.getById(userId);

    const comment = await this.commentRepository.test(
      newsfeedId,
      page,
      pageSize,
    );
    return { comment, user };
  }

  // 댓글 수정
  async modifyComment(
    userId: number,
    newsfeedId: number,
    commentId: number,
    data: CommentDTO,
  ) {
    const checkNewsfeed = await this.newsfeedRepository.checkNewsfeed(
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
    const checkComment = await this.commentRepository.checkComment(commentId);
    const checkUserId = checkComment.user['id'];
    if (userId !== checkUserId) {
      throw new ForbiddenException('권한이 존재하지 않습니다.');
    } else {
      await this.commentRepository.softDelete({
        id: commentId,
        user: { id: userId },
        newsfeed: { id: newsfeedId },
      });
    }
  }
}
