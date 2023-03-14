import { Injectable } from '@nestjs/common';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NewsfeedRepository extends Repository<NewsFeed> {
  constructor(private dataSource: DataSource) {
    super(NewsFeed, dataSource.createEntityManager());
  }
}
