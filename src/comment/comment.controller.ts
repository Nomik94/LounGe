import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { GetUser } from 'src/common/decorator/get.user.decorator';
import { CommentService } from './comment.service';
import { CommentDTO } from './dto/comment.dto';

@Controller('api/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 댓글 생성 API
  @Post('/:newsfeedId')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('newsfeedId') newsfeedId: number,
    @GetUser() user: IUser,
    @Body() data: CommentDTO,
  ): Promise<void> {
    const userId = user.id;
    return await this.commentService.createComment(userId, newsfeedId, data);
  }

  // 뉴스피드 게시물에 대한 모든 댓글 조회 API
  @Get('/:newsfeedId/:page')
  @UseGuards(JwtAuthGuard)
  async getCommentByNewsfeed(
    @Param('newsfeedId') newsfeedId: number,
    @Param('page') page: number,
  ) {
    return await this.commentService.getCommentByNewsfeed(newsfeedId, page);
  }

  // 댓글 수정 API
  @Put('/:newsfeedId/:commentId')
  @UseGuards(JwtAuthGuard)
  async modifyComment(
    @Param('newsfeedId') newsfeedId: number,
    @Param('commentId') commentId: number,
    @GetUser() user: IUser,
    @Body() data: CommentDTO,
  ): Promise<void> {
    const userId = user.id;
    await this.commentService.modifyComment(
      userId,
      newsfeedId,
      commentId,
      data,
    );
  }

  // 댓글 삭제 API
  @Delete('/:newsfeedId/:commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('newsfeedId') newsfeedId: number,
    @Param('commentId') commentId: number,
    @GetUser() user: IUser,
  ): Promise<void> {
    const userId = user.id;
    await this.commentService.deleteComment(userId, newsfeedId, commentId);
  }
}
