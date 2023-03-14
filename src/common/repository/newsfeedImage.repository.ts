import { Injectable } from '@nestjs/common';
import { NewsFeedImage } from 'src/database/entities/newsFeedImage.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NewsfeedImageRepository extends Repository<NewsFeedImage> {
  constructor(private dataSource: DataSource) {
    super(NewsFeedImage, dataSource.createEntityManager());
  }
}
