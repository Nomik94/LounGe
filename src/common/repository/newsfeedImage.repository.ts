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

  createNewsfeedImage(filename:string,newsfeedId:number){
    return this.save({
      image: filename,
      newsFeed: {id:newsfeedId}
    })
  }

  modifyNewsfeedImage(filename:string,id:number){
    return this.save({
      image: filename,
      newsFeed: {id:id}
    })
  }
}
