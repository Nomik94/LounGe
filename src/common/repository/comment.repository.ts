import { Injectable } from '@nestjs/common';
import { Comment } from 'src/database/entities/comment.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(private dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  // 댓글ID로 유저정보 가져오기
  async getCommentByNewsfeedId(
    newsfeedId: number,
    page: number,
    pageSize: number,
  ): Promise<Comment[]> {
    const comment = await this.createQueryBuilder('comment')
      .select([
        'comment.id',
        'comment.content',
        'comment.createdAt',
        'user.image',
        'user.username',
        'user.id',
      ])
      .leftJoin('comment.user', 'user')
      .where('comment.newsfeed = :id', { id: newsfeedId })
      .orderBy({ 'comment.createdAt': 'DESC' })
      .take(pageSize)
      .skip(pageSize * (page - 1))
      .getMany();
    return comment;
  }

  // 댓글ID로 유저ID 가져오기
  async getUserIdByCommentId(commentId: number): Promise<Comment> {
    return await this.createQueryBuilder('comment')
      .select(['comment.id', 'user.id'])
      .leftJoin('comment.user', 'user')
      .where('comment.id = :id', { id: commentId })
      .getOne();
  }
}
