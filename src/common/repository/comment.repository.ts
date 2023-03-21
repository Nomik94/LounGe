import { Injectable } from '@nestjs/common';
import { Comment } from 'src/database/entities/comment.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(private dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  async getUserByComment(commentId: number) {
    return await this.find({
      select: ['id', 'content', 'createdAt', 'user'],
      relations: ['user'],
      where: { id: commentId },
      order: { createdAt: 'desc' },
    });
  }
}
