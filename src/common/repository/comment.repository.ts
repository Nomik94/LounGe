import { Injectable } from '@nestjs/common';
import { Comment } from 'src/database/entities/comment.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(private dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  async getUserByComment(newsfeedId: number, page: number, pageSize: number) {
    const comment = await this.find({
      select: ['id', 'content', 'createdAt', 'user'],
      relations: ['user'],
      where: { newsfeed: { id: newsfeedId } },
      order: { createdAt: 'desc' },
      take: pageSize,
      skip: pageSize * (page - 1),
    });

    return comment;
  }

  async checkComment(id: number) {
    return await this.findOne({
      relations: ['user'],
      where: { id },
    });
  }
}
