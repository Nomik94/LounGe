import { Injectable } from '@nestjs/common';
import { NewsFeedTag } from 'src/database/entities/newsFeed-Tag.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NewsfeedTagRepository extends Repository<NewsFeedTag> {
  constructor(private dataSource: DataSource) {
    super(NewsFeedTag, dataSource.createEntityManager());
  }

  async deleteNewsfeedTag(id:number):Promise<void>{
    await this.delete({
      newsFeedId:id
    })
  }

  async createNewsfeed(id:number,newsfeedId:number):Promise<void>{
    await this.save({
      tagId:id,
      newsFeedId: newsfeedId
    })
  }

  async modifyNewsfeed(tagId:number,id:number):Promise<void>{
    await this.save({
      tagId:tagId,
      newsFeedId: id
    })
  }

  async serchTagArray(whereNewsfeedId:object[]):Promise<NewsFeedTag[]>{
    return await this.find({
      where: whereNewsfeedId,
      select: ['newsFeedId']
    })
  }
}
