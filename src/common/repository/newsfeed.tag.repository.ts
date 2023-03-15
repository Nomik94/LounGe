import { Injectable } from '@nestjs/common';
import { NewsFeedTag } from 'src/database/entities/newsFeed-Tag.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NewsfeedTagRepository extends Repository<NewsFeedTag> {
  constructor(private dataSource: DataSource) {
    super(NewsFeedTag, dataSource.createEntityManager());
  }

  deleteNewsfeedTag(id:number){
    return this.delete({
      newsFeedId:id
    })
  }

  createNewsfeed(id:number,newsfeedId:number){
    return this.save({
      tagId:id,
      newsFeedId: newsfeedId
    })
  }

  modifyNewsfeed(tagId:number,id:number) {
    return this.save({
      tagId:tagId,
      newsFeedId: id
    })
  }

  serchTagArray(whereNewsfeedId:object[]){
    return this.find({
      where: whereNewsfeedId,
      select: ['newsFeedId']
    })
  }
}
