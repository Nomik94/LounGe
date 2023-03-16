import { Injectable } from '@nestjs/common';
import { NewsFeedImage } from 'src/database/entities/newsFeedImage.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NewsfeedImageRepository extends Repository<NewsFeedImage> {
  constructor(private dataSource: DataSource) {
    super(NewsFeedImage, dataSource.createEntityManager());
  }

  async deleteNewsfeedImage(id: number): Promise<void> {
    await this.delete({
      newsFeed: { id: id },
    });
  }

  async createNewsfeedImage(
    filename: string,
    newsfeedId: number,
  ): Promise<NewsFeedImage> {
    return await this.save({
      image: filename,
      newsFeed: { id: newsfeedId },
    });
  }

  async modifyNewsfeedImage(
    filename: string,
    id: number,
  ): Promise<NewsFeedImage> {
    return await this.save({
      image: filename,
      newsFeed: { id: id },
    });
  }
}
