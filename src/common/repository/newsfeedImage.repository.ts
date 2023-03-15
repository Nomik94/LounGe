import { Injectable } from '@nestjs/common';
import { NewsFeedImage } from 'src/database/entities/newsFeedImage.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NewsfeedImageRepository extends Repository<NewsFeedImage> {
  constructor(private dataSource: DataSource) {
    super(NewsFeedImage, dataSource.createEntityManager());
  }

  deleteNewsfeedImage(id:number) {
    return this.delete({
      newsFeed: {id:id}
    })
  }

  createNewsfeedImage(filename,newsfeedId){
    return this.save({
      image: filename,
      newsFeed: {id:newsfeedId.id}
    })
  }

  modifyNewsfeedImage(filename:any,id:number){
    return this.save({
      image: filename,
      newsFeed: {id:id}
    })
  }
}
