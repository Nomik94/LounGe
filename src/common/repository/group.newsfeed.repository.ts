import { Injectable } from '@nestjs/common';
import { GroupNewsFeed } from 'src/database/entities/group-newsfeed.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class GroupNewsfeedRepository extends Repository<GroupNewsFeed> {
  constructor(private dataSource: DataSource) {
    super(GroupNewsFeed, dataSource.createEntityManager());
  }
}
