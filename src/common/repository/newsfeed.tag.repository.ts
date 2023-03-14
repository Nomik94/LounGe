import { Injectable } from '@nestjs/common';
import { NewsFeedTag } from 'src/database/entities/newsFeed-Tag.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NewsfeedTagRepository extends Repository<NewsFeedTag> {
  constructor(private dataSource: DataSource) {
    super(NewsFeedTag, dataSource.createEntityManager());
  }
}
