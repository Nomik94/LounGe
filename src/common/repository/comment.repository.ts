import { Injectable } from '@nestjs/common';
import { Comment } from 'src/database/entities/comment.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(private dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  async getUserByComment(commentId) {
    const comment = await this.find({
      select: ['id', 'content', 'createdAt', 'user'],
      relations: ['user'],
      where: commentId,
      order: { createdAt: 'desc' },
    });

    return comment;
  }
}
