import { Injectable } from '@nestjs/common';
import { Comment } from 'src/database/entities/comment.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(private dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  // async getUserByComment(newsfeedId: number, page: number, pageSize: number) {
  //   const comment = await this.find({
  //     select: ['id', 'content', 'createdAt', 'user'],
  //     relations: ['user'],
  //     where: { newsfeed: { id: newsfeedId } },
  //     order: { createdAt: 'desc' },
  //     take: pageSize,
  //     skip: pageSize * (page - 1),
  //   });

  //   return comment;
  // }

  async getUserByComment(newsfeedId: number, page: number, pageSize: number) {
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

  async checkComment(commentId: number) {
    return await this.createQueryBuilder('comment')
      .select(['comment.id', 'user.id'])
      .leftJoin('comment.user', 'user')
      .where('comment.id = :id', { id: commentId })
      .getOne();
  }
}
