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

  createNewsfeed(i:any,newsfeedId:any){
    return this.save({
      tagId:i,
      newsFeedId: newsfeedId.id
    })
  }

  modifyNewsfeed(i:any,id:number) {
    return this.save({
      tagId:i,
      newsFeedId: id
    })
  }

  serchTagArray(whereNewsfeedId:any){
    return this.find({
      where: whereNewsfeedId,
      select: ['newsFeedId']
    })
  }
}
