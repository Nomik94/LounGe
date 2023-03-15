import { Injectable } from '@nestjs/common';
import { TagGroup } from 'src/database/entities/tag-group.entity';
import { ITagWithGroupIds } from 'src/group/interface/tag.group.ids.interface';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TagGroupRepository extends Repository<TagGroup> {
  constructor(private dataSource: DataSource) {
    super(TagGroup, dataSource.createEntityManager());
  }

  async createTagWithGroup(mapTags: ITagWithGroupIds[]): Promise<void> {
    await this.createQueryBuilder()
      .insert()
      .into(TagGroup)
      .values(mapTags)
      .execute();
  }
}
