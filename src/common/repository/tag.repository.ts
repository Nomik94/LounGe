import { Injectable } from '@nestjs/common';
import { Tag } from 'src/database/entities/tag.entity';
import { DataSource, InsertResult, Repository } from 'typeorm';

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(private dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }

  async foundTags(tags): Promise<Tag[]> {
    return await this.createQueryBuilder('tag')
      .where('tag.tagName IN (:...tags)', { tags })
      .getMany();
  }

  async createTags(newTagNames): Promise<InsertResult> {
    return await this.createQueryBuilder()
      .insert()
      .into(Tag)
      .values(newTagNames)
      .execute();
  }
}
